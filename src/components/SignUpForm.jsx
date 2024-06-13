// SignUpForm.js
import React from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import axios from 'axios';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

const SignUpForm = () => {
    const signupDataToSend = new FormData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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

    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        //checking the password
        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords do not match.");
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
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1500);

    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });

        // Update formDataToSend directly
        signupDataToSend.set(name, value);
    };
    return (
        <div className="w-1/3 h-fit mx-auto mt-8 p-6 bg-white rounded-lg shadow-md ">
            <Toaster position="down-center" reverseOrder={false}></Toaster>
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {/* user Type */}
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
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={signupData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={signupData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Register No */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registerNo">Register No</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="registerNumber"
                            type="number"
                            placeholder="Register No"
                            name="registerNumber"
                            value={signupData.registerNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Username */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={signupData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Password */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={signupData.password}
                            passwordToggle="true"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Confirm Password */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                </div>
                {/* Year */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">Year</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="year"
                            type="number"
                            placeholder="Year"
                            name="year"
                            value={signupData.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number</label>
                    <div className="relative">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phoneNumber"
                            type="tel"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={signupData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                {/* Department */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">Department</label>
                    <div className="relative">
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="department"
                            name="department"
                            value={signupData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="computer Science">Computer SCience</option>
                            <option value='Ece'>Ece</option>
                            {/* Add options for departments */}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <MdArrowDropDown />
                        </div>
                    </div>
                </div>
                {/* Course */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">Course</label>
                    <div className="relative">
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="course"
                            name="course"
                            value={signupData.course}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Course</option>
                            {/* Add options for courses */}
                            <option value="computer Science">Computer SCience</option>
                            <option value='Ece'>Ece</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <MdArrowDropDown />
                        </div>
                    </div>
                </div>
                {/* Gender */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                    <div className="relative">
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="gender"
                            name="gender"
                            value={signupData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <MdArrowDropDown />
                        </div>
                    </div>
                </div>
                {/* Submit button */}
                <div className="mb-4">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'animate-pulse' : ''}`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </form>

        </div>
    );
};

export default SignUpForm;
