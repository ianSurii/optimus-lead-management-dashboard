


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

loadData();
const getLookups = () => {
    return loadData().lookups;
};

const getTransactions = () => {
    return loadData().transactions;
};

const getMetrics = () => {
    return loadData().metrics;
};

module.exports = {
    getLookups,
    getTransactions,
    getMetrics,
};