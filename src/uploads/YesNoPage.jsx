import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import LoadingScreen from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const YesNoPage = () => {
    const [response, setResponse] = useState('');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [professorResponded, setProfessorResponded] = useState(false);  // Track if professor responded
    const [studentName, setStudentName] = useState('');
    const [documentUrl, setDocumentUrl] = useState(null);
    const [professorName, setProfessorName] = useState('');

    const { registerNo, profEmail } = useParams();  // Get `registerNo` and `profEmail` from URL params
    const server2 = 'http://127.0.0.1:5000';  // Backend server address

    useEffect(() => {
        fetchStudentData();
        fetchDocumentUrl();
        fetchProfessorName();
        checkPreviousResponse(); // Check if a response already exists
    }, [registerNo, profEmail]);

    // Fetch student name based on register number
    const fetchStudentData = async () => {
        try {
            const response = await fetch(`${server2}/student/${registerNo}`);
            const result = await response.json();
            if (response.ok && result.studentName) {
                setStudentName(result.studentName);
            } else {
                setStudentName('Unknown');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    // Fetch the uploaded document URL
    const fetchDocumentUrl = async () => {
        try {
            const response = await fetch(`${server2}/document/${registerNo}`);
            const result = await response.json();
            if (response.ok && result.url) {
                setDocumentUrl(result.url);
            } else {
                setDocumentUrl(null);
            }
        } catch (error) {
            console.error('Error fetching document URL:', error);
        }
    };

    // Fetch professor's name using professor's email
    const fetchProfessorName = async () => {
        try {
            const response = await fetch(`${server2}/professor/${encodeURIComponent(profEmail)}`);
            const result = await response.json();
            if (response.ok && result.profName) {
                setProfessorName(result.profName); // Set professor's name
            } else {
                setProfessorName('Professor Unknown');
            }
        } catch (error) {
            console.error('Error fetching professor data:', error);
        }
    };

    // Check if the response exists for this professor
    const checkPreviousResponse = async () => {
        try {
            const response = await fetch(`${server2}/respond/${registerNo}/${encodeURIComponent(profEmail)}`);
            const result = await response.json();

            console.warn("Response from backend:", result);

            // If there's an error, it means the professor already responded
            if (result.error) {
                // Response already exists, show message and hide buttons
                setProfessorResponded(true); // Set professorResponded to true
                setResponse(result.error); // Show the error message (professor already responded)
            } else if (result.response) {
                // If response is 'Yes' or 'No', mark as responded
                setProfessorResponded(true);  // Set to true as the professor has responded
                setResponse(result.response);  // Display the existing response (Yes or No)
            }
        } catch (error) {
            console.error('Error checking previous response:', error);
        }
    };

    // Handle the professor's response
    const handleResponse = async (answer) => {
        setIsLoading(true);
        setResponse(answer);

        try {
            const payload = { response: answer };

            // If response is 'No', require a reason
            if (answer === 'No') {
                if (!reason.trim()) {
                    toast.error('Please provide a reason for your response.');
                    setIsLoading(false);
                    return;
                }
                payload.reason = reason;
            }

            // Construct API URL dynamically using registerNo and profEmail
            const url = `${server2}/respond/${registerNo}/${encodeURIComponent(profEmail)}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (res.ok) {
                toast.success(result.message || `You selected "${answer}".`);
                setReason(''); // Clear reason after successful submission
                setProfessorResponded(true); // Mark as professor has responded
            } else {
                toast.error(result.error || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error in handleResponse:', error);
            toast.error('An error occurred while processing your response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex-grow">
                    <Navbar />
                    <Toaster position="top-center" reverseOrder={false} />
                    <div className="upload-bg md:px-0 px-10 py-8">
                        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
                            <h1 className="text-3xl font-semibold mb-6 text-center">Confirmation of Response</h1>
                            <div className="mb-6 text-lg">
            {/* Professor name greeting dynamically */}
            <p className="mb-4">
                <strong>Dear Professor {professorName},</strong>
                <br />
                We hope this message finds you well. Below is the draft submitted by {studentName}, a student with the register number <strong>{registerNo}</strong>. Kindly review the attached document and provide your valuable feedback by selecting the appropriate response.
            </p>
        </div>

                            {/* Display the uploaded document or action */}
                            {documentUrl ? (
                                <div className="mb-6 text-center">
                                    <p className="text-gray-700 mb-4">Document Uploaded Successfully!</p>
                                    <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                                        <button className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition">
                                            View Document
                                        </button>
                                    </a>
                                </div>
                            ) : (
                                <div className="mb-6 text-center">
                                    <p className="text-gray-500">No document uploaded yet.</p>
                                </div>
                            )}

                            {/* Show response buttons only if the professor hasn't responded yet */}
                            {professorResponded ? (
                                <div className="mt-6 text-center">
                                    <p className="text-green-600 font-semibold">
                                        {response}  {/* Show the error message or the response */}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex justify-center space-x-6">
                                    <button
                                        className="bg-green-600 text-white py-2 px-8 rounded-full hover:bg-green-700 transition"
                                        onClick={() => handleResponse('Yes')}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-red-600 text-white py-2 px-8 rounded-full hover:bg-red-700 transition"
                                        onClick={() => handleResponse('No')}
                                    >
                                        No
                                    </button>
                                </div>
                            )}

                            {/* Show textarea for reason if the response is No */}
                            {response === 'No' && !professorResponded && (
                                <div className="mt-6">
                                    <textarea
                                        className="w-full p-3 border rounded-md bg-gray-100"
                                        placeholder="Please provide a reason for your response."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <div className="text-center mt-4">
                                        <button
                                            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition"
                                            onClick={() => handleResponse('No')}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Confirmation message */}
                            {response && response !== 'No' && (
                                <div className="mt-6 p-4 bg-blue-100 rounded-lg text-center">
                                    You selected: <strong>{response}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default YesNoPage;
