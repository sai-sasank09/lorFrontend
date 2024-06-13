import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './footer';
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import LoadingScreen from './Loader';

function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otp, setOTP] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState();
    const [passwordUpdated, setPasswordUpdated] = useState(true);

    useEffect(() => {
        // Clear OTP and verification result when switching between email and OTP input
        setOTP('');
        setVerificationResult('');
    }, [showOTPInput]);

    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'
 
    const handleEmailSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${server2}/check-email-exists`, { email });
            const { exists } = response.data;

            if (exists) {
                toast.success("OTP Sent..!!");
                setShowOTPInput(true);
                setIsLoading(false)
            } else {
                toast.error("Mail Id Don't Exist")
                console.log('Email does not exist');
            }
        } catch (error) {
            console.error('Error checking email existence:', error);
        }
        finally {
            setIsLoading(false)
        }
    };

    const handleOTPSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${server2}/verify-otp`, { email, otp });
            const { verified } = response.data;
            if (verified) {
                toast.success("OTP Verified Successfully")
                setShowOTPInput(false);
                setVerificationResult('OTP verified successfully');
                setPasswordUpdated(false)
            } else {
                setVerificationResult('OTP verification failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
        finally {
            setIsLoading(false)
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword === confirmPassword) {
            setIsLoading(true)
            try {
                await axios.post(`${server2}/update-password`, { email, newPassword });
                toast.success("Password has changed SuccessFully")
                setPasswordUpdated(true);
                <Link to={'/'} />
            } catch (error) {
                console.error('Error updating password:', error);
            }
            finally {
                setIsLoading(false)
            }
        } else {
            toast.error("Passwords do not match")
            console.log('Passwords do not match');
        }
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />
                    <div className="flex flex-col items-center justify-center upload-bg">
                        <Toaster position="top-center" reverseOrder={false}></Toaster>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                            {!showOTPInput && passwordUpdated && (
                                <div className="mb-4">
                                    <p className="text-gray-600">Please enter your email:</p>
                                    <input
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-3"
                                        onClick={showOTPInput ? handleOTPSubmit : handleEmailSubmit}
                                    >
                                        {showOTPInput ? 'Submit OTP' : 'Submit'}
                                    </button>
                                </div>

                            )}
                            {showOTPInput && (
                                <div className="mb-4">
                                    <p className="text-gray-600">Enter the OTP sent to your email:</p>
                                    <input
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
                                        type="text"
                                        placeholder="OTP"
                                        value={otp}
                                        onChange={(e) => setOTP(e.target.value)}
                                    />
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-3"
                                        onClick={showOTPInput ? handleOTPSubmit : handleEmailSubmit}
                                    >
                                        {showOTPInput ? 'Submit OTP' : 'Submit'}
                                    </button>
                                </div>
                            )}

                            {verificationResult && <p>{verificationResult}</p>}
                            {passwordUpdated ? (
                                <p></p>
                            ) : !showOTPInput && !passwordUpdated && (
                                <>
                                    <div className="mb-4">
                                        <p className="text-gray-600">Enter your new password:</p>
                                        <input
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-gray-600">Confirm your new password:</p>
                                        <input
                                            className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-2"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <Link
                                        to="/login"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={handlePasswordUpdate}
                                    >
                                        Update Password
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default ResetPasswordPage;
