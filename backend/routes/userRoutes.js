const express = require('express');
const router = express.Router();
const sessionServices = require('../services/sessionServices');



router.get('/user', (req, res) => {
    try {
     
        const userData = sessionServices.getUserData()
        console.log(userData);

        res.status(200).json(userData);

    } catch (error) {
        console.error(`[API ERROR] Failed to fetch user data:`, error.message);
        
        res.status(500).json({ 
            message: "Internal Server Error: Could not process user data.", 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Notifications endpoint
router.get('/notifications', (req, res) => {
    try {
        const notifications = sessionServices.getNotifications();

        res.status(200).json(notifications);

    } catch (error) {
        console.error(`[API ERROR] Failed to fetch notifications:`, error.message);
        
        res.status(500).json({ 
            message: "Internal Server Error: Could not process notifications.", 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
);

// Banner endpoint
router.get('/banner', (req, res) => {
    try {
        const banner = sessionServices.getBanner();

        res.status(200).json(banner);

    }
    catch (error) {
        console.error(`[API ERROR] Failed to fetch banner:`, error.message);
        
        res.status(500).json({
            message: "Internal Server Error: Could not process banner.",
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
);


module.exports = router;