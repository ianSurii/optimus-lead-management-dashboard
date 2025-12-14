const express = require('express');
const router = express.Router();

const dashboardServices = require('../services/dashboardServices');


router.get('/dashboard', (req, res) => {
    try {
        const filters = req.query;
        console.log('📊 Dashboard request received with filters:', filters);
        
        const dashboardData = dashboardServices.getDashboardData(filters);
        
        console.log('✅ Dashboard data processed:', {
            totalRecords: dashboardData.summary?.total_records,
            dateRange: dashboardData.summary?.date_range
        });

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error(`[API ERROR] Failed to fetch dashboard data:`, error.message);
        
        res.status(500).json({ 
            message: "Internal Server Error: Could not process dashboard data.", 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;