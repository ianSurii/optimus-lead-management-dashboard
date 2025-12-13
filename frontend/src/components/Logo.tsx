// src/components/Logo.tsx

import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 ">
            <div className="w-10 h-10 rounded-lg flex items-center  bg-white justify-center" >
                <span className="text-2xl font-extrabold " style={{color:"#26A9D8"}}>O</span>
            </div>
            <h1 className="text-xl font-bold text-white">optimus</h1>
        </div>
    );
};

export default Logo;
