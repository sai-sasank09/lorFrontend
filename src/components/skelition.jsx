import React from 'react';

const SkeletonLoader = () => {
    // Apply styles to the body element to make it fill the entire viewport
    document.body.style.height = '100vh';
    document.body.style.margin = '0';

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="grid grid-cols-4 gap-8">
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-2 rounded">
                        <div className="skeleton h-40 w-72"></div>
                        <div className="skeleton h-6 w-48"></div>
                        <div className="skeleton h-6 w-full"></div>
                        <div className="skeleton h-6 w-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonLoader;
