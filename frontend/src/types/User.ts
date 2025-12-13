export interface IUserProfile {

    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
    managed_product_id?: string;
    primary_branch_id?: string;
    profile_pic_url?: string;
}
 
export interface IBanner {
    active:   boolean;
    text:     string;
    style:    string;
    link_url: string;
}

export interface INotification {
    id:        number;
    type:      string;
    message:   string;
    link:      string;
    timestamp: Date;
    read:      boolean;
}
