let allData = null;

// load data from JSON file

const loadData = () => {
    if (!allData) {
        const dataPath = require('../config').dataPath;
        const fs = require('fs');
        const path = require('path');
        const rawData  = fs.readFileSync(path.join(__dirname, dataPath));
        
        console.log("Loading data from:", path.join(__dirname, dataPath));
        allData = JSON.parse(rawData);
    }
    return allData;
};

// Initialize data on module load
loadData();

// Get all lookup data
const getLookups = () => {
    const data = loadData();
    
    return {
        users: data.users || [],
        branches: data.branches || [],
        campaigns: data.campaigns || [],
        segments: data.segments || [],
        products: data.products || []
    };
};

// Get all transactions
const getTransactions = () => {
    return loadData().transactions || [];
};

// Get revenue targets
const getRevenueTargets = () => {
    return loadData().revenue_targets || [];
};

// Get user profile
const getUserProfile = () => {
    return loadData().user_profile || null;
};

// Get notifications
const getNotifications = () => {
    return loadData().notifications || [];
};

// Get banner
const getBanner = () => {
    return loadData().banner || null;
};

// Advanced query with filters
const getTransactionsWithFilters = (filters = {}) => {
    let transactions = getTransactions();
    
    // Filter by date range (default: last 31 days from current date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dateFrom, dateTo;
    
    // Handle single 'date' filter (31 days ending on selected date)
    if (filters.date) {
        const selectedDate = new Date(filters.date);
        selectedDate.setHours(0, 0, 0, 0);
        dateTo = selectedDate;
        dateFrom = new Date(selectedDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 31 days including selected date
    } 
    // Handle date range filters
    else {
        dateFrom = filters.date_from 
            ? new Date(filters.date_from) 
            : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        dateTo = filters.date_to 
            ? new Date(filters.date_to) 
            : today;
    }
    
    transactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        txnDate.setHours(0, 0, 0, 0);
        return txnDate >= dateFrom && txnDate <= dateTo;
    });
    
    // Filter by branch
    if (filters.branch_id) {
        transactions = transactions.filter(txn => txn.branch_id === filters.branch_id);
    }
    
    // Filter by agent/user
    if (filters.user_id) {
        transactions = transactions.filter(txn => txn.user_id === filters.user_id);
    }
    
    // Filter by product
    if (filters.product_id) {
        transactions = transactions.filter(txn => txn.product_id === filters.product_id);
    }
    
    // Filter by campaign
    if (filters.campaign_id) {
        transactions = transactions.filter(txn => txn.campaign_id === filters.campaign_id);
    }
    
    // Filter by segment
    if (filters.segment_id) {
        transactions = transactions.filter(txn => txn.segment_id === filters.segment_id);
    }
    
    // Filter by status
    if (filters.status) {
        transactions = transactions.filter(txn => txn.status === filters.status);
    }
    
    // Filter by country (through branch)
    if (filters.country) {
        const lookups = getLookups();
        const countryBranches = lookups.branches
            .filter(b => b.country === filters.country)
            .map(b => b.branch_id);
        transactions = transactions.filter(txn => countryBranches.includes(txn.branch_id));
    }
    
    return transactions;
};
//user branch ranking
const getBranchRanking = () => {
    const transactions = getTransactions();
    const branchTotals = {};
    
    transactions.forEach(txn => {
        if (!branchTotals[txn.branch_id]) {
            branchTotals[txn.branch_id] = 0;
        }
        branchTotals[txn.branch_id] += txn.amount;
    }
);
    const rankings = Object.entries(branchTotals)
        .map(([branch_id, total_amount]) => ({ branch_id, total_amount }))
        .sort((a, b) => b.total_amount - a.total_amount);
            
    return rankings;
}

// get country ranking
const getCountryRanking = () => {
    const lookups = getLookups();
    const transactions = getTransactions();
    const countryTotals = {};
    
    transactions.forEach(txn => {
        const branch = lookups.branches.find(b => b.branch_id === txn.branch_id);
        if (branch) {
            const country = branch.country;
            if (!countryTotals[country]) {
                countryTotals[country] = 0;
            }
            countryTotals[country] += txn.amount;
        }
    });

    const rankings = Object.entries(countryTotals)
        .map(([country, total_amount]) => ({ country, total_amount }))
        .sort((a, b) => b.total_amount - a.total_amount);
            
    return rankings;
}
module.exports = {
    getLookups,
    getTransactions,
    getRevenueTargets,
    getUserProfile,
    getNotifications,
    getBanner,
    getTransactionsWithFilters,
  
};