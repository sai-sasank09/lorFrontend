import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
// import Footer from './footer';
import { MdSearch } from 'react-icons/md';
import UnauthorizedPage from './UnauthorizedPageStaff';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showUnauthorizedPage, setShowUnauthorizedPage] = useState(false);
    useEffect(() => {
        fetchDocuments();
    }, []);


    // server's link 
    const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const storedTokenstaff = localStorage.getItem('token_staff');
            if (!storedTokenstaff) {
                setError('Token is missing or invalid.');
                setLoading(false);
                setShowUnauthorizedPage(true);
                return;
            }
            const response = await axios.get(`${server2}/staff/documents`, {
                headers: {
                    Authorization: `Bearer ${storedTokenstaff}` // Include the JWT token in the Authorization header
                }
            });
            setDocuments(response.data.documents);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'An error occurred while fetching documents.');
            setLoading(false);
            if (error.response && error.response.status === 401) {
                // If response status is 401, show the unauthorized page
                setShowUnauthorizedPage(true);
            }
        }
    };


    useEffect(() => {
        const results = documents.filter(document =>
            document.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            document.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
    }, [searchQuery]);

    if (loading) {
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

    }

    if (error) {
        setShowUnauthorizedPage(true);
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {showUnauthorizedPage && <UnauthorizedPage />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />
                    <div className="container mx-auto p-6">
                        <div className="flex items-center mb-4 ">
                            <div className="relative flex-grow mr-2 border border-gray-700 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition duration-400 hover:border-red-600">
                                <input
                                    type="text"
                                    placeholder="Search documents or Register Number"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 px-4 focus:outline-none"
                                />
                                <button className="absolute right-0 top-0 bottom-0 bg-blue-500 text-white px-3 py-2 rounded-r-md focus:outline-none hover:bg-blue-600 transition duration-300">
                                    <MdSearch className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
                        <div className="flex flex-wrap -mx-4">
                            {(searchQuery ? searchResults : documents).map(document => (
                                <div key={document.file_id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                                    <a href={`${server2}/staff/documents/${document.file_id}`} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                        {/* <div className="p-4 hover:bg-gray-100"> */}
                                        <div className="card w-96 bg-base-100 shadow-xl">
                                            <div className="card-body">
                                                <h2 className="card-title">{document.filename}</h2>
                                                <p>Register Number: {document.registerNumber}</p>
                                                <p className="text-gray-600 text-sm">{new Date(document.upload_date).toLocaleDateString()}</p>
                                                <p className="text-gray-600 text-sm mt-2">{document.content_type}</p>
                                                <div className="card-actions">
                                                    <button className="btn btn-primary">Dowload</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        </>
    );
};

export default DocumentList;
