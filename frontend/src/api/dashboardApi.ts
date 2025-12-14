// src/api/dashboardApi.ts

import { IDashboardData } from '../types/Dashboard';

const API_URL = process.env.REACT_APP_API_URL||"http://localhost:3000";
// const API_URL = "http://localhost:3000";
const API_VERSION = process.env.REACT_APP_API_VERSION||'/api/v1';

// Define the type for filters, allowing string, number, or undefined values
interface Filters {
    // Index signature: keys must be strings
    [key: string]: string | number | undefined; 
}

// Function returns a Promise that resolves to the IDashboardData interface
export async function fetchDashboardData(filters: Filters = {}): Promise<IDashboardData> {
    
    // Check if API_URL exists to prevent crash
    if (!API_URL) {
        throw new Error("REACT_APP_API_URL is not defined in environment.");
    }

    const url = new URL(`${API_URL}${API_VERSION}/dashboard`);
    
    
    (Object.keys(filters) as string[]).forEach((key: string) => {
        
        const filterValue = filters[key]; 

        if (filterValue !== undefined) {
            
            const stringValue = String(filterValue); 
            
            
            url.searchParams.append(key, stringValue);
        }
    });

    try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }

        // Cast the returned JSON to the expected type
        return (await response.json()) as IDashboardData;
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to connect to the backend service.');
    }
}