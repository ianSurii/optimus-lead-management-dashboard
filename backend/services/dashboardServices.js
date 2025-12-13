
const dataRepository = require('../repositories/dashboardRepository');


const getUserName = (userId, lookups) => {
    const user = lookups.users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'N/A';
};


const applyFilters = (transactions, filters) => {
    return transactions.filter(txn => {
        if (filters.branch && txn.branch_id !== filters.branch) {
            return false;
        }
        return true;
    });
};


const calculateKPIs = (filteredTransactions) => {
    
   ``

    const totalRevenue = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalLeads = filteredTransactions.length;
    const closedTransactions = filteredTransactions.filter(txn => txn.status === 'Closed').length;
    
    const conversionRate = totalLeads > 0 ? (closedTransactions / totalLeads) * 100 : 0;
    const avgTAT = totalLeads > 0 ? Math.round(
        filteredTransactions.reduce((sum, txn) => sum + txn.turn_around_time, 0) / totalLeads
    ) : 0;

    return [
        { 
            id: "total_revenue", 
            label: "Total Revenue", 
            value: totalRevenue.toFixed(2), 
            unit: "USD", 
            change_percentage: 5.5, 
            change_direction: "up" 
        },
        { 
            id: "avg_tat", 
            label: "Avg Turn Around Time", 
            value: avgTAT, 
            unit: "days", 
            change_percentage: -1.2, 
            change_direction: "down" 
        },
        { 
            id: "total_leads", 
            label: "Total Leads Processed", 
            value: totalLeads, 
            unit: "count", 
            change_percentage: 10.1, 
            change_direction: "up" 
        },
        { 
            id: "conversion_rate", 
            label: "Conversion Rate", 
            value: conversionRate.toFixed(1), 
            unit: "%", 
            change_percentage: 2.5, 
            change_direction: "up" 
        },
    ];
};



const createChartData = (filteredTransactions, metrics) => {

    const monthlyActuals = filteredTransactions.reduce((acc, txn) => {
        // Assuming txn.date is 'YYYY-MM-DD' format
        const month = txn.date.substring(0, 7); 
        acc[month] = (acc[month] || 0) + txn.amount;
        return acc;
    }, {});
    
    // Get targets from the metrics data
    const monthlyTargets = metrics.revenue_targets.reduce((acc, target) => {
        acc[target.month] = target.target_amount;
        return acc;
    }, {});
    
    const chartLabels = Object.keys({...monthlyActuals, ...monthlyTargets}).sort();

    return {
        // Line chart showing monthly revenue vs. target
        monthly_revenue: {
            type: 'line',
            labels: chartLabels,
            datasets: [
                {
                    label: 'Actual Revenue',
                    data: chartLabels.map(month => monthlyActuals[month] || 0),
                    borderColor: '#3b82f6',
                    tension: 0.1,
                    fill: false,
                },
                {
                    label: 'Target Revenue',
                    data: chartLabels.map(month => monthlyTargets[month] || 0),
                    borderColor: '#ef4444', // Red for Target
                    borderDash: [5, 5],
                    tension: 0.1,
                    fill: false,
                }
            ]
        },
        // Example 2: Bar chart showing leads by transaction status
        status_breakdown: {
            type: 'bar',
            labels: ['Pending', 'Processing', 'Closed', 'Rejected'],
            datasets: [{ 
                label: 'Lead Count', 
                data: ['Pending', 'Processing', 'Closed', 'Rejected'].map(
                    status => filteredTransactions.filter(txn => txn.status === status).length
                ),
                backgroundColor: ['#fde047', '#38bdf8', '#4ade80', '#ef4444']
            }]
        }
    };
};


// --- 5. Denormalization for Table View ---
const denormalizeTransactions = (filteredTransactions, lookups) => {
    return filteredTransactions.map(txn => ({
        id: txn.txn_id,
        customer_name: txn.customer_name,
        branch_name: lookups.branches.find(b => b.branch_id === txn.branch_id)?.name || 'N/A',
        agent_name: getUserName(txn.user_id, lookups),
        amount: txn.amount,
        status: txn.status,
        date: txn.date,
    }));
};


// --- 6. Main Service Function (Exposed) ---

const getDashboardData = (filters = {}) => {
    // 1. Get raw data from Repository
    const allTransactions = dataRepository.getTransactions();
    const lookups = dataRepository.getLookups();
    const metrics = dataRepository.getMetrics(); // Metrics are fetched here
    
    // 2. Apply Filtering Logic
    const filteredTransactions = applyFilters(allTransactions, filters);
    
    // 3. Perform Aggregation & Calculations
    const kpiMetrics = calculateKPIs(filteredTransactions);
    // 4. FIX: Pass metrics to the chart data function
    const chartData = createChartData(filteredTransactions, metrics); 
    
    // 5. Denormalize for Table View
    const transactionList = denormalizeTransactions(filteredTransactions, lookups);
    
    // 6. Structure the final single payload
    return {
        filters: {
            available_branches: lookups.branches,
            available_users: lookups.users,
        },
        kpi_metrics: kpiMetrics,
        transaction_list: transactionList.slice(0, 50), 
        
        // Final Chart Data
        charts: chartData,
    };
};

module.exports = {
    getDashboardData,
};