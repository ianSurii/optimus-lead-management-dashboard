import { IBranchPerformance } from "./Dashboard";
import { ICountryRanking } from "./Dashboard";

export interface Recommendation {
    title: string;
    description: string;
}

export interface Rankings {
    branch_ranking: number;
    country_ranking: number;
}

export interface ActionableInsightsProps {
    recommendations: Recommendation[];
    rankings: Rankings;
    branchPerformance: IBranchPerformance[];
    countryRanking: ICountryRanking[];
    userBranchId?: string;
}