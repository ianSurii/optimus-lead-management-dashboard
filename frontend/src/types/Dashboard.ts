/** Represents an individual KPI metric card. */
export interface IKpiMetric {
    id: string;
    label: string;
    value: string | number;
    unit: string;
    change_percentage: number;
    change_direction: 'up' | 'down';
}

/** Represents a single transaction record. */
export interface ITransaction {
    txn_id: string;
    user_id: string;
    branch_id: string;
    customer_name: string;
    amount: number;
    status: 'Closed' | 'Pending' | 'Processing' | 'Rejected';
    date: string; // ISO Date string (e.g., "2025-12-10")
    user_name?: string;
    branch_name?: string;
}

/** Represents the data structure for the charts (placeholder). */
export interface IChartData {
   
    data: { [key: string]: any }[];
    meta: { title: string; type: string };
}

/** The overall shape of the data returned by the /dashboard API endpoint. */
export interface IDashboardData {
    kpi_metrics: IKpiMetric[];
    transaction_list: ITransaction[];
    charts: {
        monthly_revenue: IChartData;
        status_breakdown: IChartData;
    };
    lookups: {
        users: { user_id: string; first_name: string; last_name: string }[];
        branches: { branch_id: string; name: string }[];
    };
}