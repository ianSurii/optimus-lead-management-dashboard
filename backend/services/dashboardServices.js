const dataRepository = require('../repositories/dashboardRepository');


// ============= HELPER FUNCTIONS =============

const getUserName = (userId, lookups) => {
    const user = lookups.users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'N/A';
};

const getBranchName = (branchId, lookups) => {
    const branch = lookups.branches.find(b => b.branch_id === branchId);
    return branch ? branch.name : 'N/A';
};

const getProductName = (productId, lookups) => {
    const product = lookups.products.find(p => p.product_id === productId);
    return product ? product.name : 'N/A';
};

const getCampaignName = (campaignId, lookups) => {
    const campaign = lookups.campaigns.find(c => c.campaign_id === campaignId);
    return campaign ? campaign.name : 'N/A';
};

const getSegmentName = (segmentId, lookups) => {
    const segment = lookups.segments.find(s => s.segment_id === segmentId);
    return segment ? segment.name : 'N/A';
};

const calculateDaysBetween = (dateFrom, dateTo) => {
    if (!dateFrom || !dateTo) return null;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24));
};

const getDateRange = (days) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    return { startDate, endDate: today };
};

// ============= KEY METRICS CALCULATION =============

const calculateKPIs = (filteredTransactions) => {
    const totalLeads = filteredTransactions.length;
    
    // Total contacted leads (To Callback Later + Product/Service Sold + Closed)
    const contactedLeads = filteredTransactions.filter(
        txn => txn.status === 'To Callback Later' || 
               txn.status === 'Product/Service Sold' || 
               txn.status === 'Closed'
    ).length;
    
    // Closed/Converted leads (Product/Service Sold + Closed)
    const closedLeads = filteredTransactions.filter(
        txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed'
    ).length;
    
    // Conversion rate (closed / total leads)
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;
    
 // Calculate average TAT for closed deals only
const closedDeals = filteredTransactions.filter(
    txn => txn.closed_date && 
           txn.date && 
           (txn.status === 'Product/Service Sold' || txn.status === 'Closed')
);

let avgTAT = 0;
if (closedDeals.length > 0) {
    const totalTAT = closedDeals.reduce((sum, txn) => {
        const days = calculateDaysBetween(txn.date, txn.closed_date);
        // Only add valid day counts (not null or NaN)
        if (days !== null && !isNaN(days) && days >= 0) {
            return sum + days;
        }
        return sum;
    }, 0);
    
    // Count only valid calculations for average
    const validCount = closedDeals.filter(txn => {
        const days = calculateDaysBetween(txn.date, txn.closed_date);
        return days !== null && !isNaN(days) && days >= 0;
    }).length;
    
    avgTAT = validCount > 0 ? (totalTAT / validCount).toFixed(1) : 0;
}
    
    // Total revenue from closed deals
    const totalRevenue = filteredTransactions
        .filter(txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed')
        .reduce((sum, txn) => sum + txn.amount, 0);

    return [
        { 
            id: "avg_tat", 
            label: "Avg Turn Around Time", 
            value: avgTAT || 0, 
            unit: "days", 
            change_percentage: -1.2, 
            change_direction: "down" 
        },
        { 
            id: "total_revenue", 
            label: "Total Revenue", 
            value: totalRevenue.toFixed(2), 
            unit: "USD", 
            change_percentage: 5.5, 
            change_direction: "up" 
        },
        { 
            id: "total_leads", 
            label: "Total Leads", 
            value: totalLeads, 
            unit: "count", 
            change_percentage: 10.1, 
            change_direction: "up" 
        },
        { 
            id: "contacted_leads", 
            label: "Contacted Leads", 
            value: contactedLeads, 
            unit: "count", 
            change_percentage: 8.3, 
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


// ============= BOT RECOMMEDATIONS AND RANKING ==========

const recommedationsAndRankings = (filteredTransactions) => {

    let recommedations1 =
    {
        "title": "Increase Follow-ups",
        "description": "Boost your conversion rates by scheduling regular follow-ups with potential clients. Consistent communication can turn leads into loyal customers."
    }

    let recommedations2 = 
    {
        "title":"Increase Conversion Rate",
        "description":"Increase your conversion rate by 2% by calling client between 8.00 am-12.00 pm"
    }

    
    return {
        recommendations: [
            recommedations1,
            recommedations2

        ],
        rankings: {
            "branch_ranking": 98,
            "country_ranking": 76

        }
    };


}

// ============= 7-DAY METRICS =============

const calculate7DayMetrics = (allTransactions) => {
    const { startDate, endDate } = getDateRange(7);
    
    const last7Days = allTransactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate && txnDate <= endDate;
    });
    
    const totalLeads = last7Days.length;
    const closedLeads = last7Days.filter(
        txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed'
    ).length;
    
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;
    
    return {
        period: '7_days',
        total_leads: totalLeads,
        closed_leads: closedLeads,
        conversion_rate: conversionRate.toFixed(1)
    };
};

// ============= AGENT PERFORMANCE =============

const calculateAgentPerformance = (filteredTransactions, lookups, revenueTargets, period = 7) => {
    const { startDate, endDate } = getDateRange(period);
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Filter transactions for the period
    const periodTransactions = filteredTransactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate && txnDate <= endDate;
    });
    
    const agentStats = {};
    
    // Initialize all users
    lookups.users.forEach(user => {
        agentStats[user.user_id] = {
            user_id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            total_revenue: 0,
            total_leads: 0,
            closed_leads: 0,
            open_leads: 0,
            contacted_leads: 0,
            avg_tat: 0,
            target: 0,
            achievement_percent: 0,
            branch_id: null,
            branch_name: null
        };
    });
    
    // Aggregate transaction data per agent
    periodTransactions.forEach(txn => {
        if (agentStats[txn.user_id]) {
            agentStats[txn.user_id].total_leads += 1;
            
            if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                agentStats[txn.user_id].closed_leads += 1;
                agentStats[txn.user_id].total_revenue += txn.amount;
            } else if (txn.status === 'Open' || txn.status === 'Processing') {
                agentStats[txn.user_id].open_leads += 1;
            }
            
            if (txn.status === 'To Callback Later' || txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                agentStats[txn.user_id].contacted_leads += 1;
            }
            
            // Set branch info
            if (!agentStats[txn.user_id].branch_id) {
                agentStats[txn.user_id].branch_id = txn.branch_id;
                agentStats[txn.user_id].branch_name = getBranchName(txn.branch_id, lookups);
            }
        }
    });
    
    // Calculate avg TAT per agent
    Object.keys(agentStats).forEach(userId => {
        const agentClosedDeals = periodTransactions.filter(
            txn => txn.user_id === userId && 
                   txn.closed_date && 
                   (txn.status === 'Product/Service Sold' || txn.status === 'Closed')
        );
        
        if (agentClosedDeals.length > 0) {
            const totalTAT = agentClosedDeals.reduce((sum, txn) => {
                return sum + (calculateDaysBetween(txn.date, txn.closed_date) || 0);
            }, 0);
            agentStats[userId].avg_tat = (totalTAT / agentClosedDeals.length).toFixed(1);
        }
    });
    
    // Add targets and calculate achievement
    revenueTargets.forEach(target => {
        if (target.month === currentMonth && agentStats[target.user_id]) {
            agentStats[target.user_id].target = target.target_amount;
            agentStats[target.user_id].achievement_percent = 
                target.target_amount > 0 
                    ? ((agentStats[target.user_id].total_revenue / target.target_amount) * 100).toFixed(1)
                    : 0;
        }
    });
    
    return Object.values(agentStats).sort((a, b) => b.closed_leads - a.closed_leads);
};

// ============= BRANCH PERFORMANCE =============

const calculateBranchPerformance = (filteredTransactions, lookups, revenueTargets, period = 7) => {
    const { startDate, endDate } = getDateRange(period);
    
    const periodTransactions = filteredTransactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startDate && txnDate <= endDate;
    });
    
    const branchStats = {};
    
    // Initialize branches
    lookups.branches.forEach(branch => {
        branchStats[branch.branch_id] = {
            branch_id: branch.branch_id,
            branch_name: branch.name,
            region: branch.region,
            country: branch.country,
            total_revenue: 0,
            total_leads: 0,
            closed_leads: 0,
            conversion_rate: 0,
            avg_tat: 0,
            target: 0,
            achievement_percent: 0
        };
    });
    
    // Aggregate branch data
    periodTransactions.forEach(txn => {
        if (branchStats[txn.branch_id]) {
            branchStats[txn.branch_id].total_leads += 1;
            
            if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                branchStats[txn.branch_id].closed_leads += 1;
                branchStats[txn.branch_id].total_revenue += txn.amount;
            }
        }
    });
    
    // Calculate conversion rates and TAT
    Object.values(branchStats).forEach(branch => {
        branch.conversion_rate = branch.total_leads > 0 
            ? ((branch.closed_leads / branch.total_leads) * 100).toFixed(1) 
            : 0;
        
        const branchClosedDeals = periodTransactions.filter(
            txn => txn.branch_id === branch.branch_id && 
                   txn.closed_date && 
                   (txn.status === 'Product/Service Sold' || txn.status === 'Closed')
        );
        
        if (branchClosedDeals.length > 0) {
            const totalTAT = branchClosedDeals.reduce((sum, txn) => {
                return sum + (calculateDaysBetween(txn.date, txn.closed_date) || 0);
            }, 0);
            branch.avg_tat = (totalTAT / branchClosedDeals.length).toFixed(1);
        }
    });
    
    // Calculate branch targets (sum of agent targets)
    const currentMonth = new Date().toISOString().substring(0, 7);
    const agentPerf = calculateAgentPerformance(filteredTransactions, lookups, revenueTargets, period);
    
    agentPerf.forEach(agent => {
        if (agent.branch_id && branchStats[agent.branch_id]) {
            const target = revenueTargets.find(
                t => t.user_id === agent.user_id && t.month === currentMonth
            );
            if (target) {
                branchStats[agent.branch_id].target += target.target_amount;
            }
        }
    });
    
    // Calculate achievement percentage
    Object.values(branchStats).forEach(branch => {
        branch.achievement_percent = branch.target > 0 
            ? ((branch.total_revenue / branch.target) * 100).toFixed(1) 
            : 0;
    });
    
    return Object.values(branchStats).sort((a, b) => b.total_revenue - a.total_revenue);
};

// ============= COUNTRY RANKING =============

const calculateCountryRanking = (filteredTransactions, lookups) => {
    const countryStats = {};
    
    filteredTransactions.forEach(txn => {
        const branch = lookups.branches.find(b => b.branch_id === txn.branch_id);
        if (branch && branch.country) {
            if (!countryStats[branch.country]) {
                countryStats[branch.country] = {
                    country: branch.country,
                    total_revenue: 0,
                    total_leads: 0,
                    closed_leads: 0,
                    conversion_rate: 0
                };
            }
            
            countryStats[branch.country].total_leads += 1;
            
            if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                countryStats[branch.country].closed_leads += 1;
                countryStats[branch.country].total_revenue += txn.amount;
            }
        }
    });
    
    // Calculate conversion rates
    Object.values(countryStats).forEach(country => {
        country.conversion_rate = country.total_leads > 0 
            ? ((country.closed_leads / country.total_leads) * 100).toFixed(1) 
            : 0;
    });
    
    return Object.values(countryStats).sort((a, b) => b.total_revenue - a.total_revenue);
};

// ============= 7-DAY REVENUE BY BRANCH (LINE CHART) =============

const calculate7DayRevenueByBranch = (filteredTransactions, lookups, revenueTargets) => {
    const { startDate, endDate } = getDateRange(7);
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Create daily labels
    const labels = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        labels.push(date.toISOString().split('T')[0]);
    }
    
    const branchData = {};
    const branchTargets = {};
    
    // Initialize branch data
    lookups.branches.forEach(branch => {
        branchData[branch.branch_id] = {
            branch_name: branch.name,
            daily_revenue: new Array(7).fill(0),
            daily_closed: new Array(7).fill(0)
        };
        
        // Calculate branch target (sum of agent targets)
        const branchAgents = filteredTransactions
            .filter(txn => txn.branch_id === branch.branch_id)
            .map(txn => txn.user_id)
            .filter((v, i, a) => a.indexOf(v) === i);
        
        branchTargets[branch.branch_id] = revenueTargets
            .filter(t => t.month === currentMonth && branchAgents.includes(t.user_id))
            .reduce((sum, t) => sum + t.target_amount, 0);
    });
    
    // Aggregate daily data
    filteredTransactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        if (txnDate >= startDate && txnDate <= endDate) {
            const dayIndex = calculateDaysBetween(startDate, txnDate);
            
            if (dayIndex >= 0 && dayIndex < 7 && branchData[txn.branch_id]) {
                if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                    branchData[txn.branch_id].daily_revenue[dayIndex] += txn.amount;
                    branchData[txn.branch_id].daily_closed[dayIndex] += 1;
                }
            }
        }
    });
    
    // Format for chart
    const datasets = [];
    Object.keys(branchData).forEach((branchId, index) => {
        const branch = branchData[branchId];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        
        // Actual revenue line
        datasets.push({
            label: `${branch.branch_name} - Revenue`,
            data: branch.daily_revenue,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.1,
            fill: false
        });
        
        // Target line (flat line for comparison)
        const dailyTarget = branchTargets[branchId] / 30; // Monthly target / 30 days
        datasets.push({
            label: `${branch.branch_name} - Target`,
            data: new Array(7).fill(dailyTarget),
            borderColor: colors[index % colors.length],
            borderDash: [5, 5],
            tension: 0,
            fill: false
        });
    });
    
    return {
        type: 'line',
        labels: labels,
        datasets: datasets
    };
};

// ============= CHART DATA =============

const createChartData = (filteredTransactions, revenueTargets, lookups) => {
    // Status breakdown
    const statusLabels = ['Open', 'Processing', 'To Callback Later', 'Closed', 'Product/Service Sold'];
    const statusCounts = statusLabels.map(
        status => filteredTransactions.filter(txn => txn.status === status).length
    );
    
    // Revenue by product
    const productRevenue = {};
    filteredTransactions.forEach(txn => {
        if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
            const productName = getProductName(txn.product_id, lookups);
            productRevenue[productName] = (productRevenue[productName] || 0) + txn.amount;
        }
    });
    
    return {
        status_breakdown: {
            type: 'bar',
            labels: statusLabels,
            datasets: [{ 
                label: 'Lead Count', 
                data: statusCounts,
                backgroundColor: ['#94a3b8', '#38bdf8', '#fbbf24', '#10b981', '#059669']
            }]
        },
        revenue_by_product: {
            type: 'pie',
            labels: Object.keys(productRevenue),
            datasets: [{
                data: Object.values(productRevenue),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
            }]
        },
        revenue_by_branch_7days: calculate7DayRevenueByBranch(filteredTransactions, lookups, revenueTargets)
    };
};

// ============= DENORMALIZE TRANSACTIONS =============

const denormalizeTransactions = (filteredTransactions, lookups) => {
    return filteredTransactions.map(txn => ({
        id: txn.txn_id,
        txn_id: txn.txn_id,
        customer_name: txn.customer_name,
        branch_name: getBranchName(txn.branch_id, lookups),
        branch_id: txn.branch_id,
        agent_name: getUserName(txn.user_id, lookups),
        user_id: txn.user_id,
        product_name: getProductName(txn.product_id, lookups),
        product_id: txn.product_id,
        campaign_name: getCampaignName(txn.campaign_id, lookups),
        campaign_id: txn.campaign_id,
        segment_name: getSegmentName(txn.segment_id, lookups),
        segment_id: txn.segment_id,
        amount: txn.amount,
        status: txn.status,
        date: txn.date,
        closed_date: txn.closed_date,
        tat_days: calculateDaysBetween(txn.date, txn.closed_date)
    }));
};

// ============= MAIN SERVICE FUNCTION =============

const getDashboardData = (filters = {}) => {
    // Get filtered transactions (defaults to last 31 days)
    const filteredTransactions = dataRepository.getTransactionsWithFilters(filters);
    const lookups = dataRepository.getLookups();
    const revenueTargets = dataRepository.getRevenueTargets();
    
    // Calculate metrics
    const kpiMetrics = calculateKPIs(filteredTransactions);
    const sevenDayMetrics = calculate7DayMetrics(filteredTransactions);
    
    // Agent and branch performance (7-day period)
    const agentPerformance = calculateAgentPerformance(filteredTransactions, lookups, revenueTargets, 7);
    const branchPerformance = calculateBranchPerformance(filteredTransactions, lookups, revenueTargets, 7);
    const countryRanking = calculateCountryRanking(filteredTransactions, lookups);
    
    // Create chart data
    const chartData = createChartData(filteredTransactions, revenueTargets, lookups);
    
    // Denormalize transactions
    const transactionList = denormalizeTransactions(filteredTransactions, lookups);
    
    // Determine actual date range used
    const dates = filteredTransactions.map(txn => new Date(txn.date));
    const actualDateFrom = dates.length > 0 ? new Date(Math.min(...dates)).toISOString().split('T')[0] : null;
    const actualDateTo = dates.length > 0 ? new Date(Math.max(...dates)).toISOString().split('T')[0] : null;
    
    return {
        filters: {
            applied: filters,
            available_branches: lookups.branches,
            available_users: lookups.users,
            available_campaigns: lookups.campaigns,
            available_segments: lookups.segments,
            available_products: lookups.products,
        },
        kpi_metrics: kpiMetrics,
        seven_day_metrics: sevenDayMetrics,
        transaction_list: transactionList.slice(0, 50),
        charts: chartData,
        agent_performance: agentPerformance,
        branch_performance: branchPerformance,
        country_ranking: countryRanking,
        summary: {
            total_records: filteredTransactions.length,
            date_range: {
                from: actualDateFrom,
                to: actualDateTo
            }
        }
    };
};


module.exports = {
    getDashboardData,
};