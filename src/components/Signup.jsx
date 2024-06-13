// SignUp.js
import React from 'react';
import SignUpForm from './SignUpForm';
import Navbar from './Navbar';

const SignUp = () => {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <SignUpForm />
            </div>
        </>
    );
};

export default SignUp;
 