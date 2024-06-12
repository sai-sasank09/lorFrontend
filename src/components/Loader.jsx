import React from 'react';
import './Loader.css'; // Import CSS file for styling

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="circle one"></div>
                <div className="circle two"></div>
                <div className="circle three"></div>
            </div>
        </div>
    );
};

export default Loader;

