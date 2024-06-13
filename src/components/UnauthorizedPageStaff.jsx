import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPageStaff = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4 text-red-600 animate-pulse">Unauthorized Access</h1>
            <p className="text-lg text-gray-700 mb-8">
                Your session has expired. Please log in again.
            </p>
            <Link
                to="/stafflogin"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            >
                Go to Login Page
            </Link>
        </div>
    );
}; 

export default UnauthorizedPageStaff;
