// src/api/dashboardApi.ts

import { IDashboardData } from '../types/Dashboard';

const API_URL = process.env.REACT_APP_API_URL;
const API_VERSION = '/api/v1';

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
    
    // FIX APPLIED HERE:
    // 1. Assert Object.keys(filters) as a simple array of strings (string[]).
    // 2. Explicitly type the 'key' argument in the forEach callback as 'string'.
    (Object.keys(filters) as string[]).forEach((key: string) => {
        
        // This is necessary because filters[key] might be string | number | undefined
        const filterValue = filters[key]; 

        if (filterValue !== undefined) {
            // FIX (Value): Explicitly convert the value to a string
            const stringValue = String(filterValue); 
            
            // Both arguments (key and stringValue) are now guaranteed to be strings.
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