const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sessionRoutes = require('./routes/userRoutes');
const app = express();
const PORT = config.port || 3000;

const BASE_URL = config.basePath;



// Middleware
app.use(cors());
app.use(express.json());

// set root to redirect  to base url
app.get('/', (req, res) => {
    res.redirect(BASE_URL);
});

app.get(`${BASE_URL}/`, (req, res) => {
    res.send({ status: 'Dashboard API is running successfully!!', version: '' + config.apiVersion });
});
app.use(BASE_URL, sessionRoutes);




app.use(BASE_URL, dashboardRoutes);

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Backend Server running on port ${PORT}`);
    console.log(`🔌 API Endpoint: http://localhost:${PORT}${BASE_URL}/dashboard`);
    console.log(`======================================================`);
});