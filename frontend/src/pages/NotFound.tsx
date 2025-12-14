import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
            <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">404</h1>
            <p className="mt-8 text-xl text-gray-600">We can't find the page you're looking for.</p>
            <Link 
                to="/" 
                className="mt-6 px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
                Go Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;