// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';


// Placeholder pages
const AgentsPage: React.FC = () => <div className="text-xl p-6">Agent Performance View</div>;
const SettingsPage: React.FC = () => <div className="text-xl p-6">Application Settings</div>;
const MarketingPage: React.FC = () => <div className="text-xl p-6">Marketing Page</div>;
const CampaignsPage: React.FC = () => <div className="text-xl p-6">Campaigns Page</div>;
const StudiosPage: React.FC = () => <div className="text-xl p-6">Studio Page</div>;


const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <Router>
            <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <Routes>
                    {/* Main Dashboard Route */}
                    <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
                    
                    {/* Menu Routes */}
                    <Route path="/transactions" element={<NotFound />} />
                    <Route path="/agents" element={<AgentsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/marketing" element={<MarketingPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/studio" element={<StudiosPage />} />


                    {/* 404 Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;