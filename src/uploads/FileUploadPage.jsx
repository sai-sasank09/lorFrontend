import React, { useState } from 'react';
import Navbar from './../components/Navbar';
import Footer from '../components/footer';
import axios from 'axios';
import LoadingScreen from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast'
const FileUploadPage = () => {
    const [file, setFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [number, setNumber] = useState('');
    const [isLoading, setIsLoading] = useState();


    // server's link 
    const server2 = 'http://127.0.0.1:5000'
    // const server2 = 'https://lorbackend.onrender.com'


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    const handleNumberChange = (event) => {
        const value = event.target.value;
        setNumber(value);
    };

    const handleUpload = async () => {
        setIsLoading(true);
        if (!number) {
            toast.error("Register Number Not Found")
            setIsLoading(false);
            return;
        }
        if (!file) {
            toast.error('Please select a file to upload.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        console.log(file);
        formData.append('student_id', number);
        console.log(formData);
        formData.append('text', "iam goutham")
        console.log(formData)

        try {
            const response = await axios.post(`${server2}/staff/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('File uploaded successfully! File ID: ' + response.data.file_id);
        } catch (error) {
            setSuccessMessage('Error uploading file.');
        } finally {
            setIsLoading(false);
        }

    };
    // TODO: need to change the file name when the staff uploades document to student
    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />
                    <Toaster position="top-center" reverseOrder={false}></Toaster>
                    <div className="upload-bg md:px-0 px-10">
                        <div className='lg:w-1/4 md:w-2/4 s:w-2/4 xs:w-3/4 border p-4 bg-white md:bg-opacity-75 bg-opacity-80 backdrop-filter  rounded-lg shadow-lg'>
                            <div className="container mx-auto px-4 py-8">

                                <h1 className="text-3xl font-bold mb-4">File Upload</h1>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Enter student Register Number"
                                        value={number}
                                        onChange={handleNumberChange}
                                        className="w-full px-3 py-2 border border-gray-700 hover:shadow-xl transition duration-400 rounded-md placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                                        style={{ fontSize: '1.2rem' }}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"

                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                                {successMessage && (
                                    <div className="mt-4 bg-green-200 text-green-800 p-3 rounded">
                                        {successMessage}
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

export default FileUploadPage;
