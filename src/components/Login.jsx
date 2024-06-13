import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast'
import Footer from './footer';
import LoadingScreen from './Loader';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { MdArrowDropDown } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Login = () => {
    const userType = 'student';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeForm, setActiveForm] = useState('login');
    const navigate = useNavigate();
    const signupDataToSend= new FormData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    const [signupData, setSignupData] = useState({
        userType: 'student',
        username: '',
        email: '',
        password: '',
        profile: '',
        registerNumber: '',
        year: '',
        phoneNumber: '',
        department: '',
        course: '',
        gender: ''
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        //checking the password
        setIsLoading(true);
        if (signupData.password !== signupData.confirmPassword) {
            // alert("Passwords do not match.");
            setIsLoading(false);
            toast.error("Passwords don not match.");
            return;
        }

        // Check password strength
        // const passwordStrengthRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        // if (!passwordStrengthRegex.test(signupData.password)) {
        //     alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
        //     return;
        // }
        // Debugging: Log event target to inspect its structure
        console.log(event.target);

        // Set userType in signupDataToSend

        signupDataToSend.set('userType', signupData.userType);


        // Rest of the code...
        try {
            console.log("signupForm in log", signupDataToSend)
            const response = await axios.post(`${server2}/register`, signupDataToSend);
            console.log(response.data);
            // Handle success, e.g., show a success message to the user
            if (response.status === 201) {
                // Registration successful
                console.log(response.data.message); // Log success message
                // Show success message to the user
                toast.success(response.data.message);
                setActiveForm('login');


            } else {
                // Handle other responses
                console.log(response.data.message); // Log error message
                // Show error message to the user
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error.response.data);
            // Handle error, e.g., show an error message to the user
            toast.error("Email and Username already exists");
        }
        finally {
            setIsLoading(false);
        }
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1500);

    };
    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${server2}/login`, {
                userType: userType,
                username: username,
                password: password
            });

            if (response.data.success) {
                // Store token in local storage
                localStorage.setItem('token', response.data.token);

                // Redirect user based on user type
                if (userType === 'student') {
                    navigate('/student/dashboard');
                } else if (userType === 'staff') {
                    navigate('/staff/dashboard');
                }
            } else {
                // Display error toast
                toast.error("Invalid Username or Password");
            }
        } catch (error) {
            // Handle network errors
            console.error('Error:', error);
            toast.error("UserName Not Found..!");
        } finally {
            setIsLoading(false);
        }
    };
    // const handleSignUp = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.post(`${server2}/signup`, {
    //             name: name,
    //             email: email,
    //             registerNumber: registerNumber,
    //             username: username,
    //             password: password
    //         });

    //         if (response.data.success) {
    //             toast.success("Signed up successfully!");
    //             setActiveForm('login');
    //         } else {
    //             toast.error("Signup failed. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         toast.error("An error occurred. Please try again later.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });

        // Update formDataToSend directly
        signupDataToSend.set(name, value);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleForm = (formType) => {
        setActiveForm(formType);
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />
                    <div className="loginbg md:px-0 px-4 ">
                        <div className="lg:flex lg:space-x-20">
                            <div className=" md:w-1/2 s:w-full xs:w-full flex md:bottom-10  sm:bottom-10 lg:justify-end  lg:items-end z-10 md:z-10 ">
                                <Toaster position="top-center" reverseOrder={false}></Toaster>
                                <div className="text-slate-100 ">
                                    <h1 className="font-bold text-3xl md:text-4xl lg:text-6xl lg:pb-20">
                                        <span className="inline-block py-2">
                                            <span className="text-rose-500">L</span>etter
                                        </span> <br />
                                        <span className="inline-block py-2">
                                            <span className="text-rose-500">O</span>f
                                        </span> <br />
                                        <span className="inline-block py-2">
                                            <span className="text-rose-500">R</span>ecommendation
                                        </span>
                                    </h1>
                                </div>
                            </div>
                            <div className="bg-white w-full lg:w-1/2 p-4 rounded-lg shadow-lg z-10 overflow-auto max-h-full ">
                                <div className="flex justify-center mb-4 p-2">
                                    <button
                                        className={`text-lg font-semibold ${activeForm === 'login' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-neutral-400'} focus:outline-none p-2`}
                                        onClick={() => toggleForm('login')}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`text-lg font-semibold ${activeForm === 'signup' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-neutral-400'} focus:outline-none p-2`}
                                        onClick={() => toggleForm('signup')}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                {activeForm === 'login' && (
                                    <div className="bg-gray-200 rounded-lg p-4 relative z-10">
                                        <form>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="username">
                                                    Username
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="password">
                                                    Password
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="********"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                {showPassword ? (
                                                    <MdVisibilityOff
                                                        onClick={togglePasswordVisibility}
                                                        style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)' }}
                                                    />
                                                ) : (
                                                    <MdVisibility
                                                        onClick={togglePasswordVisibility}
                                                        style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)' }}
                                                    />
                                                )}
                                            </div>

                                            <button
                                                className="w-full bg-rose-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={handleLogin}
                                            >
                                                Login
                                            </button>
                                            <div className='my-2 text-right'>
                                                <Link to="/ResetPassword" className="text-blue-500 underline">Forget Password?</Link>
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className="text-sm text-neutral-700">Don't have an account? <span className="text-blue-900 cursor-pointer" onClick={() => toggleForm('signup')}>Sign up</span></p>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {activeForm === 'signup' && (
                                    <div className="bg-gray-200 rounded-lg p-4 relative z-10 overflow-y-auto scrollbar-hidden" style={{ height: '350px' }}>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                                                    User Type
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                                        id="userType"
                                                        name="userType"
                                                        placeholder="select the user"
                                                        value={signupData.userType}
                                                        onChange={handleChange}
                                                        required
                                                    >

                                                        <option value="student">Student</option>
                                                        <option value="staff">Staff</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <MdArrowDropDown />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="name">
                                                    Name
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Name"
                                                    name="name"
                                                    value={signupData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="email">
                                                    Email
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    name="email"
                                                    value={signupData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="registerNo">
                                                    Register Number
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="registerNumber"
                                                    type="number"
                                                    placeholder="Register No"
                                                    name="registerNumber"
                                                    value={signupData.registerNumber}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="username">
                                                    Username
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    name="username"
                                                    value={signupData.username}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="password">
                                                    Password
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="password"
                                                    type="password"
                                                    placeholder="********"
                                                    name="password"
                                                    value={signupData.password}
                                                    passwordToggle="true"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="confirmPassword">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    name="confirmPassword"
                                                    value={signupData.confirmPassword}
                                                    passwordToggle="true"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="year">
                                                    Year of Graduation
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="year"
                                                    type="number"
                                                    placeholder="Year"
                                                    name="year"
                                                    value={signupData.year}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="phoneNumber">
                                                    Phone Number
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="phoneNumber"
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    name="phoneNumber"
                                                    value={signupData.phoneNumber}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="department">
                                                    Department
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="department"
                                                    name="department"
                                                    value={signupData.department}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="course">
                                                    Course
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="course"
                                                    name="course"
                                                    value={signupData.course}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block font-mono text-blue-900 font-medium mb-2" htmlFor="gender">
                                                    Gender
                                                </label>
                                                <input
                                                    className="border-b-2 border-gray-400 outline-none focus:border-slate-700 bg-gray-200 px-2 text-left"
                                                    id="gender"
                                                    name="gender"
                                                    value={signupData.gender}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <button
                                                className="w-full bg-rose-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {/* {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                                 */}
                                                Sign Up
                                            </button>
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    className="text-sm text-slate-800 hover:underline"
                                                    onClick={() => setActiveForm('login')}
                                                    type="button"
                                                >
                                                    Back to Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Login;
