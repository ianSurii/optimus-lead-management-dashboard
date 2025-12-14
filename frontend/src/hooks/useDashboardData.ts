// src/hooks/useDashboardData.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '../api/dashboardApi';
import { IDashboardData } from '../types/Dashboard';

// Define the type for the custom hook's return value
interface UseDashboardHook {
    data: IDashboardData | null;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

type Filters = { [key: string]: string | undefined }; 

export function useDashboardData(filters: Filters): UseDashboardHook {
    // State is initialized to the specific IDashboardData type or null
    const [data, setData] = useState<IDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchDashboardData(filters);
            setData(result);
        } catch (err) {
           
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [filters]); 

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { data, isLoading, error, refreshData: loadData };
}