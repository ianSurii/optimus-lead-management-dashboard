# Optimus Lead Management Dashboard - Backend Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Services & Business Logic](#services--business-logic)
- [Data Repository Layer](#data-repository-layer)
- [Configuration](#configuration)

---

## 🎯 Overview

The backend is a **Node.js/Express** REST API server that provides comprehensive dashboard data for lead management, analytics, and performance tracking. It processes transaction data, calculates KPIs, generates insights, and delivers structured responses to the frontend.

**Tech Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Source**: JSON file-based storage (mockData.json)
- **CORS**: Enabled for cross-origin requests
- **Port**: 3000 (configurable)

---

## 🏗️ Architecture

The backend follows a **3-tier layered architecture**:

```
┌─────────────────────────────────────────┐
│         Routes Layer (API)              │
│  (HTTP Request Handling & Validation)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Services Layer                  │
│  (Business Logic & Calculations)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Repository Layer                  │
│  (Data Access & Filtering)              │
└─────────────────────────────────────────┘
```

**Separation of Concerns:**
- **Routes**: Handle HTTP requests/responses
- **Services**: Implement business logic and calculations
- **Repository**: Manage data access and filtering

---

## 📁 Project Structure

```
backend/
├── config/
│   └── index.js                 # Configuration settings
├── data/
│   └── mockData.json            # Mock data source
├── repositories/
│   └── dashboardRepository.js   # Data access layer
├── routes/
│   ├── dashboardRoutes.js       # Dashboard API routes
│   └── userRoutes.js            # User & session routes
├── services/
│   ├── dashboardServices.js     # Dashboard business logic
│   └── sessionServices.js       # Session/user services
├── types/
│   └── users.ts                 # TypeScript type definitions
├── utils/
│   └── helpers.js               # Utility functions
├── server.js                    # Express server entry point
├── package.json                 # Dependencies & scripts
└── Dockerfile                   # Docker configuration
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/` | API health check | None |
| GET | `/dashboard` | Get dashboard data | `date`, `branch_id`, `user_id`, `campaign_id`, `segment_id`, `product_id` |
| GET | `/user` | Get user profile | None |
| GET | `/notifications` | Get user notifications | None |
| GET | `/banner` | Get banner message | None |

---

## 📊 API Details

### 1. Dashboard Endpoint

**GET** `/api/v1/dashboard`

Retrieves comprehensive dashboard data including KPIs, charts, rankings, and transaction lists.

#### Query Parameters (All Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `date` | string | Target date (YYYY-MM-DD). Returns 31 days of data ending on this date | `2024-12-14` |
| `date_from` | string | Start date for custom range | `2024-11-01` |
| `date_to` | string | End date for custom range | `2024-11-30` |
| `branch_id` | string | Filter by specific branch | `BRN-001` |
| `user_id` | string | Filter by specific agent/user | `USR-005` |
| `campaign_id` | string | Filter by campaign | `CMP-001` |
| `segment_id` | string | Filter by customer segment | `SEG-002` |
| `product_id` | string | Filter by product | `PRD-003` |

#### Response Structure

```json
{
  "filters": {
    "applied": { /* active filters */ },
    "available_branches": [...],
    "available_users": [...],
    "available_campaigns": [...],
    "available_segments": [...],
    "available_products": [...]
  },
  "kpi_metrics": [
    {
      "id": "total_leads",
      "label": "Total Leads",
      "value": 1250,
      "previous_value": 1100,
      "unit": "",
      "change_percentage": 13.64,
      "change_direction": "up",
      "color": "#5058FD"
    }
    // ... more KPIs
  ],
  "lead_vs_conversion": {
    "labels": ["Dec 07", "Dec 08", ...],
    "branches": {
      "BRN-001": {
        "branch_name": "Nairobi HQ",
        "daily_leads": [45, 52, ...],
        "daily_closed": [12, 15, ...],
        "daily_conversion": [26.67, 28.85, ...]
      }
    }
  },
  "revenue_vs_target": { /* 7-day revenue tracking */ },
  "branch_agent_rankings": [ /* agent performance rankings */ ],
  "country_rankings": [ /* country-level rankings */ ],
  "agent_performance_released": [ /* agent revenue data */ ],
  "top_performing_agents": [ /* top 5 agents */ ],
  "transaction_list": [ /* filtered transactions */ ],
  "charts": {
    "status_breakdown": { /* donut chart data */ },
    "revenue_by_product": { /* bar chart data */ },
    "revenue_by_branch_7days": { /* line chart data */ }
  },
  "agent_performance": [ /* detailed agent metrics */ ],
  "branch_performance": [ /* branch-level metrics */ ],
  "country_ranking": [ /* country aggregations */ ],
  "recommendations": [
    {
      "title": "Top Converting Campaign",
      "description": "Holiday Promo campaign has 45% conversion rate"
    }
  ],
  "rankings": {
    "branch_ranking": 2,
    "country_ranking": 1
  },
  "summary": {
    "total_records": 1250,
    "date_range": {
      "from": "2024-11-14",
      "to": "2024-12-14"
    }
  }
}
```

---

### 2. User Profile Endpoint

**GET** `/api/v1/user`

Returns the current user's profile information.

#### Response

```json
{
  "user_id": "USR-001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "role": "Branch Manager",
  "primary_branch_id": "BRN-001",
  "branch_name": "Nairobi HQ",
  "region": "East Africa",
  "country": "Kenya",
  "permissions": ["view_dashboard", "manage_agents", "export_reports"]
}
```

---

### 3. Notifications Endpoint

**GET** `/api/v1/notifications`

Retrieves user notifications.

#### Response

```json
[
  {
    "id": "NOT-001",
    "type": "alert",
    "message": "Your team exceeded monthly target by 15%!",
    "timestamp": "2024-12-14T09:30:00Z",
    "read": false,
    "link": "/dashboard?view=performance"
  },
  {
    "id": "NOT-002",
    "type": "info",
    "message": "New campaign 'End of Year Sale' is now active",
    "timestamp": "2024-12-13T14:20:00Z",
    "read": true,
    "link": "/campaigns/EOY2024"
  }
]
```

---

### 4. Banner Endpoint

**GET** `/api/v1/banner`

Returns the current system-wide banner message.

#### Response

```json
{
  "id": "BAN-001",
  "text": "🎉 Welcome to Optimus Lead Management Dashboard! Track your performance in real-time.",
  "active": true,
  "start_date": "2024-12-01",
  "end_date": "2024-12-31",
  "priority": "high"
}
```

---

## 🔧 Core Components

### 1. Server (server.js)

**Entry point** for the Express application.

```javascript
const express = require('express');
const cors = require('cors');
const config = require('./config');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sessionRoutes = require('./routes/userRoutes');

const app = express();
const PORT = config.port || 3000;
const BASE_URL = config.basePath; // /api/v1

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.redirect(BASE_URL));
app.get(`${BASE_URL}/`, (req, res) => res.send({ status: 'API running' }));
app.use(BASE_URL, sessionRoutes);
app.use(BASE_URL, dashboardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
  console.log(`🔌 API Endpoint: http://localhost:${PORT}${BASE_URL}/dashboard`);
});
```

**Features:**
- CORS enabled for cross-origin requests
- JSON body parsing
- Centralized route mounting
- Health check endpoint

---

### 2. Configuration (config/index.js)

Centralized configuration management.

```javascript
const config = {
  port: process.env.PORT || 3000,
  apiVersion: 'v1',
  basePath: '/api/v1',
  dataPath: '../data/mockData.json'
};

module.exports = config;
```

**Environment Variables:**
- `PORT`: Server port (default: 3000)

---

## 🗃️ Data Repository Layer

### dashboardRepository.js

Handles all data access operations. Acts as the **single source of truth** for data retrieval.

#### Key Functions

##### 1. `loadData()`
Loads and caches data from JSON file.

```javascript
const loadData = () => {
  if (!allData) {
    const dataPath = require('../config').dataPath;
    const rawData = fs.readFileSync(path.join(__dirname, dataPath));
    allData = JSON.parse(rawData);
  }
  return allData;
};
```

##### 2. `getLookups()`
Returns all lookup/reference data.

```javascript
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
```

##### 3. `getTransactions()`
Returns all transaction records.

```javascript
const getTransactions = () => {
  return loadData().transactions || [];
};
```

##### 4. `getTransactionsWithFilters(filters)`
Returns transactions filtered by date range and other criteria.

**Supported Filters:**
- `date`: Single date (returns 31 days ending on this date)
- `date_from` / `date_to`: Custom date range
- `branch_id`: Filter by branch
- `user_id`: Filter by agent/user
- `campaign_id`: Filter by campaign
- `segment_id`: Filter by customer segment
- `product_id`: Filter by product

**Default Behavior:**
If no date filter is provided, returns last 31 days from today.

```javascript
const getTransactionsWithFilters = (filters = {}) => {
  let transactions = getTransactions();
  
  // Date filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dateFrom, dateTo;
  
  if (filters.date) {
    const selectedDate = new Date(filters.date);
    selectedDate.setHours(0, 0, 0, 0);
    dateTo = selectedDate;
    dateFrom = new Date(selectedDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else {
    dateFrom = filters.date_from 
      ? new Date(filters.date_from) 
      : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateTo = filters.date_to ? new Date(filters.date_to) : today;
  }
  
  // Apply filters
  transactions = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    txnDate.setHours(0, 0, 0, 0);
    return txnDate >= dateFrom && txnDate <= dateTo;
  });
  
  if (filters.branch_id) {
    transactions = transactions.filter(txn => txn.branch_id === filters.branch_id);
  }
  
  // ... other filters
  
  return transactions;
};
```

##### 5. Other Repository Functions

- `getRevenueTargets()`: Returns revenue target data
- `getUserProfile()`: Returns user profile
- `getNotifications()`: Returns notifications
- `getBanner()`: Returns banner configuration

---

## 🧮 Services & Business Logic

### dashboardServices.js

Core business logic for dashboard data processing and calculations.

#### Helper Functions

##### Lookup Helpers
```javascript
const getUserName = (userId, lookups) => {
  const user = lookups.users.find(u => u.user_id === userId);
  return user ? `${user.first_name} ${user.last_name}` : 'N/A';
};

const getBranchName = (branchId, lookups) => {
  const branch = lookups.branches.find(b => b.branch_id === branchId);
  return branch ? branch.name : 'N/A';
};

const getProductName = (productId, lookups) => { /* ... */ };
const getCampaignName = (campaignId, lookups) => { /* ... */ };
const getSegmentName = (segmentId, lookups) => { /* ... */ };
```

##### Date Calculations
```javascript
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
```

---

#### Main Calculation Functions

##### 1. `calculateKPIs(filteredTransactions, allTransactions, filters)`

Calculates key performance indicators with period-over-period comparisons.

**KPIs Calculated:**
- **Total Leads**: Count of all transactions
- **Contacted Leads**: Transactions with status "To Callback Later", "Product/Service Sold", or "Closed"
- **Closed Leads**: Transactions with status "Product/Service Sold" or "Closed"
- **Conversion Rate**: (Closed Leads / Total Leads) × 100
- **Average TAT**: Average turnaround time for closed deals (in days)
- **Total Revenue**: Sum of amounts from closed deals

**Comparison Period:**
Compares current period with previous 31-day period (31-62 days ago).

**Output:**
```javascript
[
  {
    id: 'total_leads',
    label: 'Total Leads',
    value: 1250,
    previous_value: 1100,
    unit: '',
    change_percentage: 13.64,
    change_direction: 'up',
    color: '#5058FD'
  },
  // ... more KPIs
]
```

**Change Calculation:**
```javascript
const calculateChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
```

---

##### 2. `recommedationsAndRankings(filteredTransactions)`

Generates AI-like recommendations and calculates branch/country rankings.

**Recommendations Logic:**
- Analyzes top converting campaigns
- Identifies high-value customer segments
- Suggests product focus areas

**Ranking Logic:**
- **Branch Ranking**: Position among all branches (based on revenue)
- **Country Ranking**: Position among countries

**Output:**
```javascript
{
  recommendations: [
    {
      title: "Focus on High-Value Segments",
      description: "Premium customers show 65% conversion rate"
    }
  ],
  rankings: {
    branch_ranking: 2,
    country_ranking: 1
  }
}
```

---

##### 3. `calculateLeadsVsConversion(filteredTransactions, lookups)`

Calculates daily leads and conversion trends for the last 7 days, broken down by branch.

**Output:**
```javascript
{
  labels: ["Dec 07", "Dec 08", "Dec 09", ...],
  branches: {
    "BRN-001": {
      branch_name: "Nairobi HQ",
      daily_revenue: [45000, 52000, ...],
      daily_leads: [45, 52, ...],
      daily_closed: [12, 15, ...],
      daily_conversion: [26.67, 28.85, ...]
    }
  }
}
```

---

##### 4. `calculateRevenueVsTarget(filteredTransactions, revenueTargets, lookups)`

Tracks daily revenue against daily targets for the last 7 days.

**Output:**
```javascript
{
  labels: ["Dec 07", "Dec 08", ...],
  branches: {
    "BRN-001": {
      branch_name: "Nairobi HQ",
      daily_target: [100000, 100000, ...],
      daily_revenue: [95000, 105000, ...]
    }
  }
}
```

---

##### 5. `calculateBranchAgentRankings(filteredTransactions, allTransactions, lookups)`

Ranks agents by realized revenue with current vs. previous period comparison.

**Agent Target:** 300,000 KES per agent

**Output:**
```javascript
[
  {
    id: "USR-001",
    name: "John Doe",
    target_kes: 300000,
    current: 1,
    previous: 2,
    realised: 450000,
    realised_previous: 380000
  }
]
```

---

##### 6. `calculateCountryRankings(filteredTransactions, allTransactions, lookups)`

Aggregates performance by country with period comparison.

**Output:**
```javascript
[
  {
    id: "KE",
    country: "Kenya",
    realised: 5600000,
    previous_realised: 4800000,
    branch_count: 5
  }
]
```

---

##### 7. `calculateAgentPerformanceReleased(filteredTransactions, lookups)`

Lists agents with their realized revenue amounts.

**Output:**
```javascript
[
  {
    agent_id: "USR-001",
    agent_name: "John Doe",
    released_amount: 450000
  }
]
```

---

##### 8. `getTopPerformingAgents(filteredTransactions, lookups)`

Returns top 5 agents based on performance metrics.

**Ranking Criteria:**
1. Conversion rate (primary)
2. Turnaround time (secondary)

**Output:**
```javascript
[
  {
    agent_id: "USR-005",
    agent_name: "Jane Smith",
    turnaround_time: 2,
    conversion_rate: 68.5,
    branch_name: "Nairobi HQ"
  }
]
```

---

##### 9. `calculateAgentPerformance(filteredTransactions, lookups)`

Detailed agent-level metrics.

**Metrics per Agent:**
- Total revenue
- Total leads
- Closed leads
- Open leads
- Contacted leads
- Average TAT
- Target achievement percentage

---

##### 10. `calculateBranchPerformance(filteredTransactions, lookups, revenueTargets)`

Branch-level aggregated metrics.

**Metrics per Branch:**
- Total revenue
- Total leads
- Closed leads
- Conversion rate
- Average TAT
- Target achievement percentage

---

##### 11. `calculateCountryRankingMetrics(filteredTransactions, lookups)`

Country-level aggregations.

---

##### 12. `getCharts(filteredTransactions, lookups)`

Generates data for various charts.

**Charts:**
1. **Status Breakdown** (Donut Chart)
   - Distribution of leads by status
   
2. **Revenue by Product** (Bar Chart)
   - Revenue contribution per product
   
3. **Revenue by Branch (7 Days)** (Line Chart)
   - Daily revenue trends per branch

**Output:**
```javascript
{
  status_breakdown: {
    type: "doughnut",
    labels: ["Open", "Closed", "To Callback Later", ...],
    datasets: [{
      data: [350, 280, 120, ...],
      backgroundColor: ["#FF6384", "#36A2EB", ...]
    }]
  },
  // ... other charts
}
```

---

##### 13. `getDashboardData(filters)`

**Main orchestrator function** that combines all calculations.

```javascript
const getDashboardData = (filters = {}) => {
  const lookups = dataRepository.getLookups();
  const allTransactions = dataRepository.getTransactions();
  const filteredTransactions = dataRepository.getTransactionsWithFilters(filters);
  const revenueTargets = dataRepository.getRevenueTargets();
  
  // Calculate all metrics
  const kpiMetrics = calculateKPIs(filteredTransactions, allTransactions, filters);
  const leadVsConversion = calculateLeadsVsConversion(filteredTransactions, lookups);
  const revenueVsTarget = calculateRevenueVsTarget(filteredTransactions, revenueTargets, lookups);
  const branchAgentRankings = calculateBranchAgentRankings(filteredTransactions, allTransactions, lookups);
  // ... all other calculations
  
  return {
    filters: {
      applied: filters,
      available_branches: lookups.branches,
      available_users: lookups.users,
      available_campaigns: lookups.campaigns,
      available_segments: lookups.segments,
      available_products: lookups.products
    },
    kpi_metrics: kpiMetrics,
    lead_vs_conversion: leadVsConversion,
    revenue_vs_target: revenueVsTarget,
    branch_agent_rankings: branchAgentRankings,
    // ... all other data
    summary: {
      total_records: filteredTransactions.length,
      date_range: { /* ... */ }
    }
  };
};
```

---

### sessionServices.js

Handles user session and profile data.

#### Functions

##### `getUserData()`
Returns user profile from repository.

##### `getNotifications()`
Returns notifications from repository.

##### `getBanner()`
Returns banner configuration from repository.

```javascript
const getUserData = () => {
  return dataRepository.getUserProfile();
};

const getNotifications = () => {
  return dataRepository.getNotifications();
};

const getBanner = () => {
  return dataRepository.getBanner();
};

module.exports = {
  getUserData,
  getNotifications,
  getBanner
};
```

---

## 📄 Data Models

### Transaction Model

```json
{
  "txn_id": "TXN-001",
  "user_id": "USR-005",
  "branch_id": "BRN-001",
  "customer_name": "John Customer",
  "amount": 50000,
  "status": "Closed",
  "date": "2024-12-01",
  "closed_date": "2024-12-03",
  "product_id": "PRD-001",
  "campaign_id": "CMP-002",
  "segment_id": "SEG-001"
}
```

**Status Values:**
- `Open`
- `Pending`
- `Processing`
- `To Callback Later`
- `Product/Service Sold`
- `Closed`
- `Rejected`

---

### Branch Model

```json
{
  "branch_id": "BRN-001",
  "name": "Nairobi HQ",
  "region": "East Africa",
  "country": "Kenya"
}
```

---

### User Model

```json
{
  "user_id": "USR-001",
  "first_name": "John",
  "last_name": "Doe",
  "role": "Branch Manager",
  "email": "john.doe@example.com",
  "primary_branch_id": "BRN-001"
}
```

---

### Revenue Target Model

```json
{
  "branch_id": "BRN-001",
  "daily_target": 100000,
  "monthly_target": 3000000
}
```

---

## 🚀 Running the Backend

### Development

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000`

### Docker

```bash
docker build -t ogilvy-backend ./backend
docker run -p 3000:3000 ogilvy-backend
```

---

## 📝 Error Handling

All endpoints implement try-catch error handling:

```javascript
router.get('/dashboard', (req, res) => {
  try {
    const dashboardData = dashboardServices.getDashboardData(req.query);
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('[API ERROR]', error.message);
    res.status(500).json({ 
      message: "Internal Server Error",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

---

## 🔍 Logging

Console logging is implemented for:
- Request reception
- Data processing status
- Error details
- Server startup information

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "cors": "^2.x"
}
```

---

## 🎯 Key Features

✅ **Comprehensive KPI Calculations** with period-over-period comparisons  
✅ **Multi-dimensional Filtering** (date, branch, user, campaign, segment, product)  
✅ **Real-time Analytics** processing  
✅ **Agent Performance Tracking** and rankings  
✅ **Branch & Country Aggregations**  
✅ **Chart Data Generation** for multiple visualization types  
✅ **Recommendation Engine** for actionable insights  
✅ **Flexible Date Range Handling** (31-day rolling window or custom range)  
✅ **Lookup Data Management** for reference integrity  
✅ **Revenue vs Target Tracking**  
✅ **Conversion Rate Analysis**  
✅ **TAT (Turnaround Time) Calculations**  

---

## 🔐 Security Considerations

⚠️ **Current Implementation:**
- No authentication/authorization
- CORS enabled for all origins
- Mock data storage (JSON file)

🔒 **Production Recommendations:**
- Implement JWT-based authentication
- Add role-based access control (RBAC)
- Configure CORS for specific origins only
- Use proper database (PostgreSQL, MongoDB, etc.)
- Add request rate limiting
- Implement input validation and sanitization
- Enable HTTPS/TLS
- Add audit logging

---

## 📊 Performance Considerations

- Data is **cached in memory** after first load
- Calculations are performed **on-demand** per request
- Filtering happens **before** heavy calculations
- Date operations use optimized algorithms

**Optimization Opportunities:**
- Implement Redis caching for frequent queries
- Add database indexing (when migrating from JSON)
- Implement pagination for transaction lists
- Add background job processing for heavy calculations

---

## 🧪 Testing Recommendations

**Unit Tests:**
- Test each calculation function independently
- Verify filter logic accuracy
- Test date range calculations
- Validate lookup functions

**Integration Tests:**
- Test API endpoint responses
- Verify filter combinations
- Test error handling

**Load Tests:**
- Measure performance with large datasets
- Test concurrent request handling

---

## 🔄 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time data updates (WebSockets)
- [ ] Advanced analytics (forecasting, ML predictions)
- [ ] Export functionality (PDF, Excel)
- [ ] Email notification system
- [ ] Multi-tenancy support
- [ ] GraphQL API option
- [ ] Caching layer (Redis)
- [ ] Background job queue (Bull/RabbitMQ)
- [ ] API documentation (Swagger/OpenAPI)

---

**Last Updated**: December 14, 2025  
**Version**: 1.0.0  
**Maintained by**: Ogilvy Africa Development Team
