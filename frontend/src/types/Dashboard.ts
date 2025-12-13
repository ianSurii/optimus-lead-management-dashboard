/** Represents an individual KPI metric card. */
export interface IKpiMetric {
    id: string;
    label: string;
    value: string | number;
    previous_value: string | number;
    unit: string;
    change_percentage: number;
    change_direction: 'up' | 'down';
    color: string;
}

/** Represents a single transaction record. */
export interface ITransaction {
    id?: string;
    txn_id?: string;
    user_id?: string;
    branch_id?: string;
    customer_name: string;
    amount: number;
    status: 'Closed' | 'Pending' | 'Processing' | 'Rejected' | 'Open' | 'To Callback Later' | 'Product/Service Sold';
    date: string;
    closed_date?: string;
    tat_days?: number;
    user_name?: string;
    branch_name?: string;
    agent_name?: string;
    product_name?: string;
    product_id?: string;
    campaign_name?: string;
    campaign_id?: string;
    segment_name?: string;
    segment_id?: string;
}

/** Branch information */
export interface IBranch {
    branch_id: string;
    name: string;
    region: string;
    country: string;
}

/** User/Agent information */
export interface IUser {
    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
}

/** Campaign information */
export interface ICampaign {
    campaign_id: string;
    name: string;
}

/** Segment information */
export interface ISegment {
    segment_id: string;
    name: string;
}

/** Product information */
export interface IProduct {
    product_id: string;
    name: string;
}

/** Filter options */
export interface IFilterOptions {
    applied: { [key: string]: any };
    available_branches: IBranch[];
    available_users: IUser[];
    available_campaigns: ICampaign[];
    available_segments: ISegment[];
    available_products: IProduct[];
}

/** Branch daily data for lead vs conversion chart */
export interface IBranchDailyData {
    branch_name: string;
    daily_revenue: number[];
    daily_leads: number[];
    daily_closed: number[];
    daily_conversion: number[];
}

/** Lead vs Conversion data structure */
export interface ILeadVsConversion {
    labels: string[];
    branches: {
        [branchId: string]: IBranchDailyData;
    };
}

/** Agent performance */
export interface IAgentPerformance {
    user_id: string;
    name: string;
    role: string;
    total_revenue: number;
    total_leads: number;
    closed_leads: number;
    open_leads: number;
    contacted_leads: number;
    avg_tat: string | number;
    target: number;
    achievement_percent: string | number;
    branch_id: string | null;
    branch_name: string | null;
}

/** Branch performance */
export interface IBranchPerformance {
    branch_id: string;
    branch_name: string;
    region: string;
    country: string;
    total_revenue: number;
    total_leads: number;
    closed_leads: number;
    conversion_rate: string | number;
    avg_tat: string | number;
    target: number;
    achievement_percent: string | number;
}

/** Country ranking */
export interface ICountryRanking {
    country: string;
    total_revenue: number;
    total_leads: number;
    closed_leads: number;
    conversion_rate: string;
}

/** Chart dataset */
export interface IChartDataset {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderDash?: number[];
    tension?: number;
    fill?: boolean;
}

/** Chart data structure */
export interface IChartData {
    type: string;
    labels: string[];
    datasets: IChartDataset[];
}

/** Charts collection */
export interface ICharts {
    status_breakdown: IChartData;
    revenue_by_product: IChartData;
    revenue_by_branch_7days: IChartData;
}

/** Summary information */
export interface ISummary {
    total_records: number;
    date_range: {
        from: string;
        to: string;
    };
}

/** Recommendation */
export interface IRecommendation {
    title: string;
    description: string;
}

/** Rankings */
export interface IRankings {
    branch_ranking: number;
    country_ranking: number;
}

/** The overall shape of the data returned by the /dashboard API endpoint. */
export interface IDashboardData {
    filters: IFilterOptions;
    kpi_metrics: IKpiMetric[];
    lead_vs_conversion: ILeadVsConversion;
    transaction_list: ITransaction[];
    charts: ICharts;
    agent_performance: IAgentPerformance[];
    branch_performance: IBranchPerformance[];
    country_ranking: ICountryRanking[];
    recommendations: IRecommendation[];
    rankings: IRankings;
    summary: ISummary;
}