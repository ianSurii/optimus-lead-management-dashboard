import {IUserProfile,INotification, IBanner} from '../types/User';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "http://localhost:3000";
const API_VERSION = '/api/v1';

// Function returns a Promise that resolves to the IUserProfile interface
export async function fetchUserProfile(): Promise<IUserProfile> {
    
    // Check if API_URL exists to prevent crash
    if (!API_URL) {
        throw new Error("REACT_APP_API_URL is not defined in environment.");
    }

    const url = `${API_URL}${API_VERSION}/user`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        // Cast the returned JSON to the expected type
        return (await response.json()) as IUserProfile;
        
    } catch (error) {
        throw new Error(`Failed to fetch user profile: ${error}`);
    }
}

// notification
export async function fetchNotifications(): Promise<INotification[]> {
    
    if (!API_URL) {
        throw new Error("REACT_APP_API_URL is not defined in environment.");
    }

    const url = `${API_URL}${API_VERSION}/notifications`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        return (await response.json()) as INotification[];
        
    } catch (error) {
        throw new Error(`Failed to fetch notifications: ${error}`);
    }
}

// banner
export async function fetchBanner(): Promise<IBanner> {
    
    if (!API_URL) {
        throw new Error("REACT_APP_API_URL is not defined in environment.");
    }

    const url = `${API_URL}${API_VERSION}/banner`;
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        return (await response.json()) as IBanner;
        
    } catch (error) {
        throw new Error(`Failed to fetch banner: ${error}`);
    }
}   

