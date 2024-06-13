import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-black text-4xl font-bold mb-8 text-center"
            >
                Oops!
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-4 text-center text-red-600"
            >
                 401 - Unauthorized Access
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg mb-8 text-gray-700 text-center"
            >
                You don't have permission to access this page.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Go to Login
                </Link>
            </motion.div>
        </div>
    );
};

export default UnauthorizedPage;
