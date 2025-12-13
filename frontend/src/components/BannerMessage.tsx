import React from 'react';
import { IBanner } from '../types/User';

// Define the component's props interface
interface BannerMessageProps {
    banner: IBanner;
}

// Use React.FC (Function Component) and pass the Props interface
const BannerMessage: React.FC<BannerMessageProps> = ({ banner }) => {
    return (
        <div 
            className="fixed top-0 left-0 right-0 z-50 py-2 md:py-2 px-3 md:px-4 text-white text-center text-xs md:text-sm flex items-center justify-center min-h-[36px]"
            style={{ backgroundColor: '#242424' }}
            role="alert"
        >
            <div 
            className="banner-content max-w-full overflow-hidden text-ellipsis leading-relaxed"
            dangerouslySetInnerHTML={{ __html: banner.text }}
            />
        </div>
    );
};

export default BannerMessage;