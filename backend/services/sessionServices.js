const dataRepository = require('../repositories/dashboardRepository');

// user data
const getUserData = () => {
    return dataRepository.getUserProfile();
}

// get notifications
const getNotifications = () => {
    return dataRepository.getNotifications();
}

// get banner
const getBanner = () => {
    return dataRepository.getBanner();
}

module.exports = {
    getUserData,
    getNotifications,
    getBanner,

 };

