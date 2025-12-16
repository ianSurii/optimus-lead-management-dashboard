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

const calculateKPIs = (filteredTransactions, allTransactions, filters = {}) => {
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
        
        avgTAT = validCount > 0 ? (totalTAT / validCount) : 0;
    }
    
    // Total revenue from closed deals
    const totalRevenue = filteredTransactions
        .filter(txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed')
        .reduce((sum, txn) => sum + txn.amount, 0);

    // Calculate 31 days ago metrics for comparison
    const today = new Date();
    if (filters.date) {
        today.setTime(new Date(filters.date).getTime());
    }
    today.setHours(0, 0, 0, 0);
    
    const thirtyOneDaysAgo = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);
    const sixtyTwoDaysAgo = new Date(today.getTime() - 62 * 24 * 60 * 60 * 1000);
    
    const previousPeriodTransactions = allTransactions.filter(txn => {
        const txnDate = new Date(txn.date);
        txnDate.setHours(0, 0, 0, 0);
        return txnDate >= sixtyTwoDaysAgo && txnDate < thirtyOneDaysAgo;
    });
    
    // Apply same filters to previous period
    let filteredPreviousTransactions = previousPeriodTransactions;
    if (filters.branch_id) {
        filteredPreviousTransactions = filteredPreviousTransactions.filter(txn => txn.branch_id === filters.branch_id);
    }
    if (filters.user_id) {
        filteredPreviousTransactions = filteredPreviousTransactions.filter(txn => txn.user_id === filters.user_id);
    }
    if (filters.product_id) {
        filteredPreviousTransactions = filteredPreviousTransactions.filter(txn => txn.product_id === filters.product_id);
    }
    if (filters.campaign_id) {
        filteredPreviousTransactions = filteredPreviousTransactions.filter(txn => txn.campaign_id === filters.campaign_id);
    }
    if (filters.segment_id) {
        filteredPreviousTransactions = filteredPreviousTransactions.filter(txn => txn.segment_id === filters.segment_id);
    }
    
    // Previous period metrics
    const prevTotalLeads = filteredPreviousTransactions.length;
    const prevContactedLeads = filteredPreviousTransactions.filter(
        txn => txn.status === 'To Callback Later' || 
               txn.status === 'Product/Service Sold' || 
               txn.status === 'Closed'
    ).length;
    const prevClosedLeads = filteredPreviousTransactions.filter(
        txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed'
    ).length;
    const prevConversionRate = prevTotalLeads > 0 ? (prevClosedLeads / prevTotalLeads) * 100 : 0;
    
    const prevClosedDeals = filteredPreviousTransactions.filter(
        txn => txn.closed_date && txn.date && 
               (txn.status === 'Product/Service Sold' || txn.status === 'Closed')
    );
    let prevAvgTAT = 0;
    if (prevClosedDeals.length > 0) {
        const totalTAT = prevClosedDeals.reduce((sum, txn) => {
            const days = calculateDaysBetween(txn.date, txn.closed_date);
            if (days !== null && !isNaN(days) && days >= 0) {
                return sum + days;
            }
            return sum;
        }, 0);
        const validCount = prevClosedDeals.filter(txn => {
            const days = calculateDaysBetween(txn.date, txn.closed_date);
            return days !== null && !isNaN(days) && days >= 0;
        }).length;
        prevAvgTAT = validCount > 0 ? (totalTAT / validCount) : 0;
    }
    
    const prevTotalRevenue = filteredPreviousTransactions
        .filter(txn => txn.status === 'Product/Service Sold' || txn.status === 'Closed')
        .reduce((sum, txn) => sum + txn.amount, 0);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const tatChange = calculateChange(avgTAT, prevAvgTAT);
    const revenueChange = calculateChange(totalRevenue, prevTotalRevenue);
    const leadsChange = calculateChange(totalLeads, prevTotalLeads);
    const contactedChange = calculateChange(contactedLeads, prevContactedLeads);
    const conversionChange = calculateChange(conversionRate, prevConversionRate);

    return [
        { 
            id: "turn_around_time", 
            label: "Avg Turn Around Time", 
            value: avgTAT.toFixed(1), 
            previous_value: prevAvgTAT.toFixed(1),
            unit: "(days)", 
            change_percentage: Math.abs(tatChange).toFixed(1), 
            change_direction: tatChange < 0 ? "down" : "up",
            color: "#5862FC"
        },       
              { 
            id: "total_contacted_leads", 
            label: "Contacted Leads", 
            value: contactedLeads, 
            previous_value: prevContactedLeads,
            unit: "count", 
            change_percentage: Math.abs(contactedChange).toFixed(1), 
            change_direction: contactedChange >= 0 ? "up" : "down",
            color: "#FBA42A"
        },
        { 
            id: "conversion_rate", 
            label: "Conversion Rate", 
            value: conversionRate.toFixed(1), 
            previous_value: prevConversionRate.toFixed(1),
            unit: "%", 
            change_percentage: Math.abs(conversionChange).toFixed(1), 
            change_direction: conversionChange >= 0 ? "up" : "down",
            color: "#FA2965"
        },
          { 
            id: "total_leads", 
            label: "Total Leads", 
            value: totalLeads, 
            previous_value: prevTotalLeads,
            unit: "count", 
            change_percentage: Math.abs(leadsChange).toFixed(1), 
            change_direction: leadsChange >= 0 ? "up" : "down",
            color: "#26A9D8"
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

// ============= LEADS VS CONVERSION RATE (7-DAY) =============

const calculateLeadsVsConversion = (filteredTransactions, lookups) => {
    const { startDate, endDate } = getDateRange(7);
    
    // Create daily labels
    const labels = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        labels.push(date.toISOString().split('T')[0]);
    }
    
    // Calculate daily metrics per branch
    const branchData = {};
    
    // Initialize branches
    lookups.branches.forEach(branch => {
        branchData[branch.branch_id] = {
            branch_name: branch.name,
            daily_revenue: new Array(7).fill(0),
            daily_closed: new Array(7).fill(0),
            daily_leads: new Array(7).fill(0),
            daily_conversion: new Array(7).fill(0)
        };
    });
    
    // Aggregate daily data
    filteredTransactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        if (txnDate >= startDate && txnDate <= endDate) {
            const dayIndex = calculateDaysBetween(startDate, txnDate);
            
            if (dayIndex >= 0 && dayIndex < 7 && branchData[txn.branch_id]) {
                branchData[txn.branch_id].daily_leads[dayIndex] += 1;
                
                if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                    branchData[txn.branch_id].daily_closed[dayIndex] += 1;
                    branchData[txn.branch_id].daily_revenue[dayIndex] += txn.amount;
                }
            }
        }
    });
    
    // Calculate conversion rates
    Object.values(branchData).forEach(branch => {
        branch.daily_conversion = branch.daily_leads.map((leads, index) => {
            return leads > 0 ? ((branch.daily_closed[index] / leads) * 100) : 0;
        });
    });
    
    return {
        labels: labels,
        branches: branchData
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
        // revenue_by_product: {
        //     type: 'pie',
        //     labels: Object.keys(productRevenue),
        //     datasets: [{
        //         data: Object.values(productRevenue),
        //         backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
        //     }]
        // },
        // revenue_by_branch_7days: calculate7DayRevenueByBranch(filteredTransactions, lookups, revenueTargets)
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
    const allTransactions = dataRepository.getTransactions();
    const lookups = dataRepository.getLookups();
    const revenueTargets = dataRepository.getRevenueTargets();
    
    // Calculate metrics (pass all transactions and filters for comparison)
    const kpiMetrics = calculateKPIs(filteredTransactions, allTransactions, filters);
    const leadsVsConversion = calculateLeadsVsConversion(filteredTransactions, lookups);
    
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
    
    // Recommendations and rankings
    const recommendations = [
        {
            title: "Improve Your Turn Around Time",
            description: "increase your turn around time by 2% by calling your clients between 8:30 am - 12:00 pm."
        },
        {
            title: "Increase Conversion Rate",
            description: "increase your conversion rate 2% by calling your clients between 8:30 am - 12:00 pm."
        }
    ];
    
    const rankings = {
        branch_ranking: 93,
        country_ranking: 493
    };

    // Calculate revenue vs target for last 7 days
    const revenueVsTarget = calculateRevenueVsTarget(filteredTransactions, lookups);

    // Calculate branch/agent rankings
    const branchAgentRankings = calculateBranchAgentRankings(filteredTransactions, lookups, revenueTargets, filters);

    // Calculate country rankings
    const countryRankings = calculateCountryRankings(filteredTransactions, lookups);

    // Calculate agent performance by released amount
    const agentPerformanceReleased = calculateAgentPerformanceByReleased(filteredTransactions, lookups);

    // Calculate top performing agents
    const topPerformingAgents = calculateTopPerformingAgents(filteredTransactions, lookups);

   
    
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
        lead_vs_conversion: leadsVsConversion,
        revenue_vs_target: revenueVsTarget,
        branch_agent_rankings: branchAgentRankings,
        country_rankings: countryRankings,
        agent_performance_released: agentPerformanceReleased,
        top_performing_agents: topPerformingAgents,
        transaction_list: transactionList.slice(0, 50),
        charts: chartData,
        agent_performance: agentPerformance,
        branch_performance: branchPerformance,
        country_ranking: countryRanking,
        recommendations: recommendations,
        rankings: rankings,
        summary: {
            total_records: filteredTransactions.length,
            date_range: {
                from: actualDateFrom,
                to: actualDateTo
            }
        }
    };
};

// Calculate revenue vs target for last 7 days
const calculateRevenueVsTarget = (transactions, lookups) => {
    const { startDate, endDate } = getDateRange(7);
    
    // Get last 7 days
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    // Initialize branch data structure
    const branchData = {};
    lookups.branches.forEach(branch => {
        branchData[branch.branch_id] = {
            branch_name: branch.name,
            daily_target: new Array(7).fill(0),
            daily_revenue: new Array(7).fill(0)
        };
    });

    // Calculate daily revenue (closed + sold)
    transactions.forEach(txn => {
        if (txn.closed_date) {
            const closedDate = new Date(txn.closed_date).toISOString().split('T')[0];
            const dayIndex = last7Days.indexOf(closedDate);
            
            if (dayIndex !== -1 && (txn.status === 'Product/Service Sold' || txn.status === 'Closed')) {
                if (branchData[txn.branch_id]) {
                    branchData[txn.branch_id].daily_revenue[dayIndex] += txn.amount;
                }
            }
        }
    });

    // Add target values (using a simple calculation: distribute monthly target across days)
    // In a real system, you'd fetch daily/weekly targets from the database
    lookups.branches.forEach(branch => {
        const monthlyTarget = 500000; // Mock monthly target
        const dailyTarget = monthlyTarget / 30; // Approximate daily target
        
        for (let i = 0; i < 7; i++) {
            branchData[branch.branch_id].daily_target[i] = dailyTarget;
        }
    });

    return {
        labels: last7Days,
        branches: branchData
    };
};

// Calculate branch/agent rankings with current vs previous comparison
const calculateBranchAgentRankings = (transactions, lookups, revenueTargets, filters) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { startDate, endDate } = getDateRange(31);
    const previousPeriodStart = new Date(startDate.getTime() - 31 * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);

    // Calculate by agent
    const agentStats = {};
    
    lookups.users.forEach(user => {
        agentStats[user.user_id] = {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            target_kes: 300000, // Mock target per agent
            current: 0,
            previous: 0,
            realised: 0,
            realised_previous: 0
        };
    });

    transactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        const isCurrent = txnDate >= startDate && txnDate <= endDate;
        const isPrevious = txnDate >= previousPeriodStart && txnDate <= previousPeriodEnd;
        
        if (agentStats[txn.user_id]) {
            if (isCurrent) {
                agentStats[txn.user_id].current += 1;
                if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                    agentStats[txn.user_id].realised += txn.amount;
                }
            }
            
            if (isPrevious) {
                agentStats[txn.user_id].previous += 1;
                if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                    agentStats[txn.user_id].realised_previous += txn.amount;
                }
            }
        }
    });

    return Object.values(agentStats)
        .filter(agent => agent.realised > 0) // Only show agents with sales
        .sort((a, b) => b.realised - a.realised);
};

// Calculate country rankings
const calculateCountryRankings = (transactions, lookups) => {
    const { startDate, endDate } = getDateRange(31);
    const previousPeriodStart = new Date(startDate.getTime() - 31 * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);

    // Group branches by country
    const countryStats = {};
    
    lookups.branches.forEach(branch => {
        const country = branch.country || 'Kenya'; // Default to Kenya
        
        if (!countryStats[country]) {
            countryStats[country] = {
                id: country.toLowerCase().replace(/\s+/g, '-'),
                country: country,
                realised: 0,
                previous_realised: 0,
                branch_count: 0,
                branch_ids: []
            };
        }
        
        countryStats[country].branch_count += 1;
        countryStats[country].branch_ids.push(branch.branch_id);
    });

    // Calculate realised amounts
    transactions.forEach(txn => {
        const branch = lookups.branches.find(b => b.branch_id === txn.branch_id);
        if (!branch) return;
        
        const country = branch.country || 'Kenya';
        const txnDate = new Date(txn.date);
        const isCurrent = txnDate >= startDate && txnDate <= endDate;
        const isPrevious = txnDate >= previousPeriodStart && txnDate <= previousPeriodEnd;
        
        if (countryStats[country]) {
            if (isCurrent && (txn.status === 'Product/Service Sold' || txn.status === 'Closed')) {
                countryStats[country].realised += txn.amount;
            }
            
            if (isPrevious && (txn.status === 'Product/Service Sold' || txn.status === 'Closed')) {
                countryStats[country].previous_realised += txn.amount;
            }
        }
    });

    return Object.values(countryStats).sort((a, b) => b.realised - a.realised);
};

// Calculate agent performance by released amount
const calculateAgentPerformanceByReleased = (transactions, lookups) => {
    const { startDate, endDate } = getDateRange(7);
    
    const agentStats = {};
    
    // Initialize agents
    lookups.users.forEach(user => {
        agentStats[user.user_id] = {
            agent_id: user.user_id,
            agent_name: `${user.first_name} ${user.last_name}`,
            released_amount: 0
        };
    });

    // Calculate released amounts
    transactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        const isCurrent = txnDate >= startDate && txnDate <= endDate;
        
        if (isCurrent && agentStats[txn.user_id]) {
            if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                agentStats[txn.user_id].released_amount += txn.amount;
            }
        }
    });

    // Sort by released amount and return top performers
    return Object.values(agentStats)
        .filter(agent => agent.released_amount > 0)
        .sort((a, b) => b.released_amount - a.released_amount)
        .slice(0, 10); // Top 10 agents
};

// Calculate top performing agents with detailed metrics
const calculateTopPerformingAgents = (transactions, lookups) => {
    const { startDate, endDate } = getDateRange(31);
    
    const agentStats = {};
    
    // Initialize agents
    lookups.users.forEach(user => {
        agentStats[user.user_id] = {
            agent_id: user.user_id,
            agent_name: `${user.first_name} ${user.last_name}`,
            turnaround_time: 0,
            conversion_rate: 0,
            branch_name: '',
            total_leads: 0,
            closed_leads: 0,
            total_tat: 0,
            tat_count: 0
        };
    });

    // Calculate metrics
    transactions.forEach(txn => {
        const txnDate = new Date(txn.date);
        const isCurrent = txnDate >= startDate && txnDate <= endDate;
        
        if (isCurrent && agentStats[txn.user_id]) {
            agentStats[txn.user_id].total_leads += 1;
            
            if (txn.status === 'Product/Service Sold' || txn.status === 'Closed') {
                agentStats[txn.user_id].closed_leads += 1;
                
                if (txn.closed_date) {
                    const tat = calculateDaysBetween(txn.date, txn.closed_date) || 0;
                    agentStats[txn.user_id].total_tat += tat;
                    agentStats[txn.user_id].tat_count += 1;
                }
            }
            
            if (!agentStats[txn.user_id].branch_name) {
                agentStats[txn.user_id].branch_name = getBranchName(txn.branch_id, lookups);
            }
        }
    });

    // Calculate final metrics
    Object.values(agentStats).forEach(agent => {
        agent.conversion_rate = agent.total_leads > 0 
            ? Number(((agent.closed_leads / agent.total_leads) * 100).toFixed(1))
            : 0;
        
        agent.turnaround_time = agent.tat_count > 0 
            ? Number((agent.total_tat / agent.tat_count).toFixed(1))
            : 0;
    });

    // Sort by conversion rate and return top 5
    return Object.values(agentStats)
        .filter(agent => agent.total_leads > 0)
        .sort((a, b) => b.conversion_rate - a.conversion_rate)
        .slice(0, 5)
        .map(({ agent_id, agent_name, turnaround_time, conversion_rate, branch_name }) => ({
            agent_id,
            agent_name,
            turnaround_time,
            conversion_rate,
            branch_name
        }));
};


module.exports = {
    getDashboardData,
};