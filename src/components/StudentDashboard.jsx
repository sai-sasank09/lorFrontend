import React, { useEffect, useState, useCallback } from 'react';
import bgImage from '../assets/loginbg.jpg';
import Navbar from './Navbar';
import LoadingScreen from './Loader';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useTokenNavigation from '../middleware/auth';
// import Footer from './footer';
import { jwtDecode } from 'jwt-decode';
import { FaDownload } from 'react-icons/fa';
const steps = ['Personal Information', 'University Details', 'Faculty Preferences', 'Upload Documents'];

const WhiteRectangle = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    // const [applicationDetailsOpen, setApplicationDetailsOpen] = useState(false);
    // const [applicationDocumentOpen, setApplicationDocumentOpen] = useState(false);
    // const [error, setError] = useState(null);
    const [token, setToken] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    const [registerNo_doc, setRegisterNo_doc] = useState();
    const [isLoading, setIsLoading] = useState();
    const [userName, setUserName] = useState();
    
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        department: '',
        course: '',
        yearOfGraduation: '',
        mobileNumber: '',
        cgpa: '',
        backlogs: '',
        appliedCountry: '',
        appliedUniversity: '',
        appliedCourse: '',
        prof1: '',
        prof2: '',
        prof3: '',
        document1: null,
        document2: null,
        status: '',
    });
    const formDataToSend = new FormData();
    const [showForm, setShowForm] = useState(true); // State to toggle between form and application details

    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    const navigate = useNavigate();
    const checkTokenAndNavigate = useTokenNavigation();

    const fetchFile = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                console.error("Token not found in local storage.");
                return;
            }

            const decodedToken = jwtDecode(storedToken);
            const registerNumber = decodedToken.sub.registerNo;
            if (!registerNumber) {
                console.error("Register number not found in decoded token.");
                return;
            }

            const response = await axios.get(`${server2}/student/upload/get`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });

            const fileData = response.data;
            console.log("File data:", fileData);
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    }, []);

    useEffect(() => {
        checkTokenAndNavigate();

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    const decodedToken = jwtDecode(storedToken);
                    setRegisterNo_doc(decodedToken.sub.registerNo);
                    setUserName(decodedToken.sub.username);
                }

                const res = await axios.post(`${server2}/student/dashboard/getData`, {}, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });

                const data = res.data;
                if (data && data.registerNumber) {
                    setApplicationSubmitted(true);
                    setShowForm(false);
                    setFormData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/unauthorized');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        fetchFile();
    }, [checkTokenAndNavigate, fetchFile, navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {

            if (registerNo_doc !== formData.registerNumber) {
                toast.error("Check the register number..!!");
                return
            }
            // Make a POST request to send form data to the server
            formDataToSend.append('status', 'pending'); // Ensure status is sent with form data
            console.log(formDataToSend)

            const response = await axios.post(`${server2}/student/dashboard`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
                }
            });

            // handleUpload();
            console.warn(response.data); // Log the response from the server
            setApplicationSubmitted(true);
            // setApplicationDetailsOpen(false);

            if (response.status === 200) {
                // Handle successful submission
                // Close the form
                setShowForm(false);
            } else {
                // Handle other status codes if needed
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error
        }
        finally {
            setIsLoading(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Update formDataToSend directly
        formDataToSend.set(name, value);
    };


    const handleDeleteApplicationClick = async () => {
        setIsLoading(true)
        try {
            // Assuming you have the registerNumber stored in the form data
            const register_Number = formData.registerNumber; // Retrieve register number from form data
            handleDeleteFile();
            // Send a DELETE request to the server
            const response = await axios.delete(`${server2}/student/dashboard/delete`, {
                data: { registerNumber: register_Number } // Sending the register number to identify the application
            });

            console.log(response.data);
            if (response.status === 200) {
                // Set applicationSubmitted state to false
                setApplicationSubmitted(false);
                setShowForm(true); // Show the form after successful deletion
                localStorage.removeItem('applicationSubmitted'); // Remove application submission status from local storage
            }
            setApplicationSubmitted(false);
            window.location.reload();
            // setApplicationDetailsOpen(false);


        } catch (error) {
            console.error('Error deleting application:', error);
            // Handle error
        }
        finally {
            setIsLoading(false)
        }
    };
    const handleDeleteFile = async () => {
        try {
            // Extract the register number from the formData
            const registerNumber = formData.registerNumber;

            // Send a POST request to the Flask backend to delete the file
            const response = await axios.post(`${server2}/delete_gridfs_document`, {
                registerNumber: registerNumber // Sending the register number to identify the application
            });

            // Check if the response indicates success
            if (response.status === 200 && response.data.success) {
                // File deletion successful
                console.log('File deleted successfully.');
                // Optionally, update UI or show a success message
            } else {
                // Error occurred or file not found
                if (response.data.error === 'File not found') {
                    console.error('File not found.');
                    // Handle UI update or error message display accordingly
                } else {
                    console.error('Error deleting file:', response.data.error);
                    // Handle UI update or error message display accordingly
                }
            }
        } catch (error) {
            // Handle network errors or unexpected exceptions
            console.error('Error deleting file:', error);
            // Handle UI update or error message display accordingly
        }
    };

    // const handleViewDocumentClick = () => {
    //     setApplicationDocumentOpen(true); // Open application details to view documents
    // };
    const handleFileChange = async (event, count) => {
        const selectedFile = event.target.files[0];
        setIsLoading(true);
        if (!selectedFile) {
            // setSuccessMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('studentId', registerNo_doc); // Include the student ID in the form data
        formData.append('count', count); // Include the count value in the form data

        try {
            const response = await axios.post(`${server2}/student/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.message);
            // setSuccessMessage(`File ${count} uploaded successfully!`);
        } catch (error) {
            // setSuccessMessage(`Error uploading file ${count}.`);
        } finally {
            setIsLoading(false);
        }
    };


    const StepIndicator = ({ currentStep }) => {
        return (
            <div className="ml-7 mt-8 rounded mr-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <div className={`h-8 w-8 flex items-center justify-center border border-gray-200 rounded-full ${currentStep === index + 1 ? 'bg-orange-200 text-black font-semibold' : 'bg-transparent text-white font-semibold'}`}>
                            {index + 1}
                        </div>
                        <div className="ml-2 mb-2">
                            <div className={currentStep === index + 1 ? 'font-medium' : 'text-gray-400 font-normal font-sans'}>
                                STEP {index + 1}
                            </div>
                            <div className='text-gray-100 text-md font-mono'>
                                {step}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setFormData({
    //     ...formData,
    //     [name]: value,
    //   });
    // };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };


    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Handle form submission
    //     console.log('Form submitted:', formData);
    // };
    return (
        <>
            {isLoading && <LoadingScreen />}
            <Navbar />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="flex-col justify-center items-center min-h-screen">
                <div className="flex-col container mx-auto px-4 py-8">

                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-200 px-4 py-2 rounded-lg">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-xl md:text-3xl text-center text-blue-950 font-bold px-4 md:px-10">
                                LOR Application Form
                            </h1>
                        </div>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="flex text-lg font-semibold mr-0 md:mr-5">{userName}</div>
                            <div className="flex text-gray-500">{registerNo_doc}</div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-2 mt-2">Application Status</h2>
                        {formData.DeanfileId3 ? (
                            <p>Your application status: <strong className="text-green-500">Approved</strong></p>
                        ) : formData.status === 'approved' ? (
                            <p>Your application status: <strong className="text-yellow-500">Initial Approval</strong></p>
                        ) : formData.status === 'declined' ? (
                            <p>Your application status: <strong className="text-red-500">Application was Declined</strong></p>
                        ) : applicationSubmitted ? (
                            <p>Your application status: <strong className="text-blue-500">Submitted</strong></p>
                        ) : (
                            <p>Your application status: <strong className="text-gray-300">Not Applied</strong></p>
                        )}
                    </div>
                </div>
                {/* Application Status Section */}



                <div className="flex justify-center items-center max-h-screen">

                    {showForm && (
                        <div className="bg-white w-auto md:w-auto  h-auto md:h-[568px] border border-gray-400 rounded-md  flex flex-col md:flex-row  md:mx-auto">
                            <div className="bg-gray-200 w-full md:w-[274px] rounded-md mb-3 md:mt-2 md:ml-2 md:mb-2" style={{ backgroundImage: `url(${bgImage})` }}>
                                <StepIndicator currentStep={currentStep} />
                            </div>

                            <div className="w-full md:w-3/4 md:ml-10 md:mt-6 sm:overflow-y-auto flex flex-col" >
                                {/* Application form */}
                                <form className="w-full" onSubmit={handleFormSubmit}>
                                    {currentStep === 1 && (
                                        <div>
                                            <h2 className="text-3xl text-blue-950 font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <p className="text-sm text-neutral-500  mb-8">Please provide your phone number, register number, department, and CGPA details.</p>
                                            <div className=" flex md:flex-row justify-center items-center md:justify-around flex-col">
                                                <div className="">
                                                    <div className="form-group"><label htmlFor="name" className="block mb-1 font-mono text-blue-900 font-medium ">Name:</label>
                                                        <input
                                                            id="name"
                                                            type="text"
                                                            placeholder="Name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="form-group"><label htmlFor="registerNumber" className="block mb-1 font-mono text-blue-900 font-medium ">Register Number:</label>
                                                        <input
                                                            type="text"
                                                            id="registerNumber"
                                                            name="registerNumber"
                                                            value={formData.registerNumber}
                                                            onChange={handleChange}
                                                            placeholder="Register Number"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Other input fields */}
                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                                <div className="">
                                                    <div><label htmlFor="department" className="block mb-1 font-mono text-blue-900 font-medium">Department:</label>
                                                        <input
                                                            type="text"
                                                            id="department"
                                                            name="department"
                                                            value={formData.department}
                                                            onChange={handleChange}
                                                            placeholder="Department"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div><label htmlFor="course" className="block mb-1 font-mono text-blue-900 font-medium">Course:</label>
                                                        <input
                                                            type="text"
                                                            id="course"
                                                            name="course"
                                                            value={formData.course}
                                                            onChange={handleChange}
                                                            placeholder="Course"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                                <div className="">
                                                    <div><label htmlFor="cgpa" className="block mb-1 font-mono text-blue-900 font-medium">CGPA:</label>
                                                        <input
                                                            type="text"
                                                            id="cgpa"
                                                            name="cgpa"
                                                            value={formData.cgpa}
                                                            onChange={handleChange}
                                                            placeholder="CGPA"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div> <label htmlFor="backlogs" className="block mb-1 font-mono font-medium text-blue-900">Backlogs:</label>
                                                        <input
                                                            type="text"
                                                            id="backlogs"
                                                            name="backlogs"
                                                            value={formData.backlogs}
                                                            onChange={handleChange}
                                                            placeholder="Backlogs"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>



                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                                <div className="">
                                                    <div><label htmlFor="yearofGraduation" className="block mb-1 font-mono text-blue-900 font-medium">Year of Graduation:</label>
                                                        <input
                                                            type="text"
                                                            id="yearofGraduation"
                                                            name="yearofGraduation"
                                                            value={formData.yearofGraduation}
                                                            onChange={handleChange}
                                                            placeholder="Year of Graduation"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div><label htmlFor="mobileNumber" className="block mb-1 font-mono font-medium text-blue-900">Mobile Number:</label>
                                                        <input
                                                            type="number"
                                                            id="mobileNumber"
                                                            name="mobileNumber"
                                                            value={formData.mobileNumber}
                                                            onChange={handleChange}
                                                            placeholder="Mobile Number"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex flex-row lg:px-20 md:py-10 sm:px-20 justify-end'>
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className=" bg-blue-900 text-gray-100 font-semibold py-2 px-4 rounded"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    Next Step
                                                </button></div>
                                        </div>
                                    )}
                                    {currentStep === 2 && (
                                        <div>
                                            <h2 className="text-3xl text-blue-950  font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <p className="text-sm text-neutral-500  mb-8">Please provide information about the country you have applied to, <br /> the course you are interested in, and the university you prefer.</p>
                                            <div className=''>

                                                <div>
                                                    <label htmlFor="appliedCountry" className="block mb-1 font-mono text-blue-900 font-medium ">Applied Country:</label>
                                                    <input
                                                        type="text"
                                                        id="appliedCountry"
                                                        name="appliedCountry"
                                                        value={formData.appliedCountry}
                                                        onChange={handleChange}
                                                        placeholder="Applied Country"
                                                        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                        style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                    />
                                                </div>
                                                <div className='pb-10'>
                                                    <div><label htmlFor="appliedCourse" className="block mb-1 font-mono text-blue-900 font-medium">Course Interested:</label>
                                                        <input
                                                            type="text"
                                                            id="appliedCourse"
                                                            name="appliedCourse"
                                                            value={formData.appliedCourse}
                                                            onChange={handleChange}
                                                            placeholder="Course Interested"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                    <div><label htmlFor="appliedUniversity" className="block mb-1 font-mono text-blue-900 font-medium">University Preference:</label>
                                                        <input
                                                            type="text"
                                                            id="appliedUniversity"
                                                            name="appliedUniversity"
                                                            value={formData.appliedUniversity}
                                                            onChange={handleChange}
                                                            placeholder="University Preference"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between lg:px-20 sm:px-2">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className=" text-neutral-400 font-semibold py-2 px-4 rounded mt-4"
                                                >
                                                    Go Back
                                                </button>
                                                <div className='flex flex-row lg:px-20 sm:px-20 justify-end'>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className=" bg-blue-900 text-gray-100 font-semibold py-2 px-4 rounded"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        Next Step
                                                    </button></div>
                                            </div>
                                        </div>

                                    )}

                                    {currentStep === 3 && (
                                        <div>
                                            <h2 className="text-3xl text-blue-950 font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <div><p className="text-sm text-neutral-500  mb-8">Please select your preferred faculty options.</p>
                                                <div className='pb-20'>

                                                    <label htmlFor="prof1" className="block mb-1 font-mono text-blue-900 font-medium ">Faculty 1:</label>
                                                    <select
                                                        id="prof1"
                                                        name="prof1"
                                                        value={formData.prof1}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                        style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                    >
                                                        <option value="">Select Faculty 1</option>
                                                        <option value="Faculty A">Faculty A</option>
                                                        <option value="Faculty B">Faculty B</option>
                                                        <option value="Faculty C">Faculty C</option>
                                                    </select>

                                                    <label htmlFor="prof2" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 2:</label>
                                                    <select
                                                        id="prof2"
                                                        name="prof2"
                                                        value={formData.prof2}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                        style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                    >
                                                        <option value="">Select Faculty 2</option>
                                                        <option value="Faculty A">Faculty A</option>
                                                        <option value="Faculty B">Faculty B</option>
                                                        <option value="Faculty C">Faculty C</option>
                                                    </select>

                                                    <label htmlFor="prof3" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 3:</label>
                                                    <select
                                                        id="prof3"
                                                        name="prof3"
                                                        value={formData.faculty3}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                        style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                    >
                                                        <option value="">Select Faculty 3</option>
                                                        <option value="Faculty A">Faculty A</option>
                                                        <option value="Faculty B">Faculty B</option>
                                                        <option value="Faculty C">Faculty C</option>
                                                    </select>
                                                </div></div>
                                            <div className="flex justify-between lg:px-20 sm:px-2">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className=" text-neutral-400 font-semibold py-2 px-4 rounded mt-4"
                                                >
                                                    Go Back
                                                </button>
                                                <div className='flex flex-row lg:px-20 sm:px-20 justify-end'>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className=" bg-blue-900 text-gray-100 font-semibold py-2 px-4 rounded"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        Next Step
                                                    </button></div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div>
                                            <h2 className="text-3xl text-blue-950 font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <div><p className="text-sm text-neutral-500  mb-8">Please upload your GRE, IELTS and other necessary documents.</p>

                                                <label htmlFor="document1" className="block mb-1 font-mono text-blue-900 font-medium">Document 1:</label>

                                                <input
                                                    required
                                                    id="document1"
                                                    type="file"
                                                    name="file_id1"
                                                    onChange={(event) => handleFileChange(event, 1)}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    className=" border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                />

                                                <label htmlFor="document2" className="block mb-1 font-mono text-blue-900 font-medium">Document 2:</label>

                                                <input
                                                    required
                                                    id="document2"
                                                    type="file"
                                                    name="file_id2"
                                                    onChange={(event) => handleFileChange(event, 2)}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    className="border border-gray-300 rounded px-2 py-1 mb-10 w-full"
                                                    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                />
                                                <label htmlFor="document3" className="block mb-1 font-mono text-blue-900 font-medium">Document 3:</label>

                                                <input
                                                    required
                                                    id="document3"
                                                    type="file"
                                                    name="file_id3"
                                                    onChange={(event) => handleFileChange(event, 3)}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    className="border border-gray-300 rounded px-2 py-1 mb-10 w-full"
                                                    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                /></div>


                                            <div className="flex justify-between lg:px-20 sm:px-20">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className=" text-neutral-400 font-semibold py-2 px-4 rounded mt-4"
                                                >
                                                    Go Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    className=" bg-blue-900  text-gray-100 font-semibold py-2 px-4 rounded"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}


                                </form>
                            </div>
                        </div>
                    )}
                    {applicationSubmitted && !showForm && (
                        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mx-4 my-6"> {/* Card design with shadow */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Details</h2> {/* Larger header */}

                            {/* Display application details */}
                            <div className="text-gray-700"> {/* Text color for readability */}
                                <p><strong>Register Number:</strong> {formData.registerNumber}</p>
                                <p><strong>Department:</strong> {formData.department}</p>
                                <p><strong>Course:</strong> {formData.course}</p>
                                <p><strong>Year of Graduation:</strong> {formData.yearofGraduation}</p>
                                <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
                                <p><strong>CGPA:</strong> {formData.cgpa}</p>
                                <p><strong>Backlogs:</strong> {formData.backlogs}</p>
                                <p><strong>Applied Country:</strong> {formData.appliedCountry}</p>
                                <p><strong>Applied University:</strong> {formData.appliedUniversity}</p>
                                <p><strong>Applied Course:</strong> {formData.appliedCourse}</p>
                                <p><strong>Professor 1:</strong> {formData.prof1}</p>
                                <p><strong>Professor 2:</strong> {formData.prof2}</p>
                                <p><strong>Professor 3:</strong> {formData.prof3}</p>
                            </div>

                            {/* View Documents button */}
                            {/* <div className="mt-4">
                            <button
                                onClick={handleViewDocumentClick}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                            >
                                View Documents
                            </button>
                        </div> */}



                            {/* Delete Application button */}
                            {formData.status !== 'approved' && (
                                <div className="mt-6"> {/* Additional spacing for better alignment */}
                                    <button
                                        onClick={handleDeleteApplicationClick}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                                    >
                                        Delete Application
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className='flex flex-col'>
                        {formData.file_id1 && (
                            <>
                                <span className='text-xl font-semibold mb-2'>Uploaded Files</span>
                                <div className="mt-4">
                                    <a
                                        href={`${server2}/studentUploadedDocument/${formData.file_id1}`}
                                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                    >
                                        <FaDownload className="mr-2" /> Uploaded Document
                                    </a>
                                </div>
                            </>
                        )}

                        {formData.file_id2 && (
                            <div className="mt-4">
                                <a
                                    href={`${server2}/studentUploadedDocument/${formData.file_id2}`}
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                >
                                    <FaDownload className="mr-2" /> Uploaded Document
                                </a>
                            </div>
                        )}

                        {formData.file_id3 && (
                            <div className="mt-4">
                                <a
                                    href={`${server2}/studentUploadedDocument/${formData.file_id3}`}
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                >
                                    <FaDownload className="mr-2" /> Uploaded Document
                                </a>
                            </div>
                        )}

                        {formData.DeanfileId1 && (
                            <>
                                <span className='text-xl font-semibold mt-6 mb-2'>LOR's</span>
                                <div className="mt-4">
                                    <a
                                        href={`${server2}/studentdocumentButton/${formData.DeanfileId1}`}
                                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                    >
                                        <FaDownload className="mr-2" /> Download Document
                                    </a>
                                </div>
                            </>
                        )}

                        {formData.DeanfileId2 && (
                            <div className="mt-4">
                                <a
                                    href={`${server2}/studentdocumentButton/${formData.DeanfileId2}`}
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                >
                                    <FaDownload className="mr-2" /> Download Document
                                </a>
                            </div>
                        )}

                        {formData.DeanfileId3 && (
                            <div className="mt-4">
                                <a
                                    href={`${server2}/studentdocumentButton/${formData.DeanfileId3}`}
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
                                >
                                    <FaDownload className="mr-2" /> Download Document
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default WhiteRectangle;
