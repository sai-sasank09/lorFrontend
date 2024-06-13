import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios'; // Import Axios for making HTTP requests
import LoadingScreen from './Loader';
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import UnauthorizedPage from './UnauthorizedPageStaff';
const StaffDashboard = () => {
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [isLoading, setIsLoading] = useState();
    // const [file, setFile] = useState(null);
    const [openDeleteMap, setOpenDeleteMap] = useState({});
    const [showUnauthorizedPage, setShowUnauthorizedPage] = useState(false);

    // const [openDelete, setOpenDelete] = useState(false);
    // const [staffData, setStaffData] = useState(null);

    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    useEffect(() => {
        // Fetch student data from the API endpoint when the component mounts
        fetchStudentData();
    }, []); // Empty dependency array ensures this effect runs only once

    const fetchStudentData = async () => {
        try {
            const storedTokenstaff = localStorage.getItem('token_staff');
            console.log("toekrn for staff", storedTokenstaff);
            const response = await axios.get(`${server2}/staff/studentCard`, {
                headers: {
                    Authorization: `Bearer ${storedTokenstaff}` // Include the JWT token in the Authorization header
                }
            });
            console.warn(response.data); // Log response for verification
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
            if (error.response && error.response.status === 401) {
                // If response status is 401, show the unauthorized page
                setShowUnauthorizedPage(true);
            }
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const updateStudentStatus = async (_id, newStatus) => {
        try {
            await axios.put(`${server2}/students/${_id}`, { status: newStatus });
            fetchStudentData(); // Refresh student data after successful update
        } catch (error) {
            console.error('Error updating student status:', error);
        }
    };

    const updateStudentStatusApproved = async (_id, newStatus) => {
        setIsLoading(true);
        try {
            await axios.put(`${server2}/students/${_id}`, { status: newStatus });
            fetchStudentData(); // Refresh student data after successful update
            setShowUploadButton(true); // Show the upload button when approved
            setIsLoading(false);
            toast.success("Mail was Sent Sucesssfully");
        } catch (error) {
            console.error('Error updating student status:', error);
            console.log(showUploadButton)
        }

    };
 
    // Define the approveStudent and declineStudent functions here...
    // const approveStudent = (_id) => {
    //     const updatedStudents = students.map(student => {
    //         if (student._id === _id) {
    //             return { ...student, status: 'approved' };
    //         }
    //         return student;
    //     });
    //     setStudents(updatedStudents);
    // };

    // const declineStudent = (_id) => {
    //     const updatedStudents = students.map(student => {
    //         if (student._id === _id) {
    //             return { ...student, status: 'declined' };
    //         }
    //         return student;
    //     });
    //     setStudents(updatedStudents);
    // };

    // file uploading 
    const handleFileChange = async (event, registerNumber, count) => {
        const selectedFile = event.target.files[0];
        setIsLoading(true);
        if (!selectedFile) {
            console.log('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('registerNumber', registerNumber); // Append register number to FormData
        formData.append('count', count);
        console.log(formData);

        try {
            const response = await axios.post(`${server2}/Dean/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (count === 3) {
                setOpenDeleteMap(prevState => ({
                    ...prevState,
                    [registerNumber]: true
                }));
            }
            console.log(response.data);
        } catch (error) {
            console.log('Error uploading file:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // delete the file
    const handleDeleteDocument = async (registerNumber) => {


        try {
            const response = await axios.post(`${server2}/dean/delete_document`, {
                student_id: registerNumber
            });

            // Check if the document is successfully deleted from the backend
            if (response.status === 200) {
                // Update the uploadedFiles state to remove the deleted file
                // setOpenDelete(true)
            } else {
                console.error('Error deleting document:', response.data.error);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };
    const renderRows = () => {
        let filteredStudents = students;

        if (filter !== 'All') {
            filteredStudents = students.filter(student => student.status === filter);
        }

        if (filter === 'InProgress') {
            filteredStudents = students.filter(student => student.status !== 'approved' && student.status !== 'declined');
        }

        return filteredStudents.map(student => (
            <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-4 text-center">{student.name}</td>
                <td className="py-2 px-4 text-center">{student.department}</td>
                <td className={`py-2 px-4 text-center ${getStatusColor(student.status)}`}>{student.status}</td>
                <td className="py-2 px-4 text-center">{student.yearOfGraduation}</td>
                <td className="py-2 px-4 text-center">{student.cgpa}</td>
                <td className="py-2 px-4 text-center">{student.backlogs}</td>
                <td className='py-2 px-4 textcenter'>{student.registerNumber}</td>
                {/* <td className='py-2 px-4 textcenter'>{student.fileId}</td> */}
                {(filter === 'All' || filter === 'InProgress') && (
                    <td className="py-2 px-4">
                        {student.status === 'pending' && (
                            <>
                                {/* TODO: when the approve button cliks the student name and year of approva should be stored in database */}
                                <button onClick={() => updateStudentStatusApproved(student._id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded mr-2">Approve</button>
                                <button onClick={() => updateStudentStatus(student._id, 'declined')} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Decline</button>
                            </>
                        )}
                        {student.status === 'approved' && (
                            <>
                                {openDeleteMap[student.registerNumber] ? (
                                    <button onClick={() => handleDeleteDocument(student.registerNumber)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Delete Document</button>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <h3>Upload the file</h3>
                                            <input
                                                type="file"
                                                name="file_id1"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={(event) => handleFileChange(event, student.registerNumber, 1)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <h3>Upload the file</h3>
                                            <input
                                                type="file"
                                                name="file_id2"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={(event) => handleFileChange(event, student.registerNumber, 2)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <h3>Upload the file</h3>
                                            <input
                                                type="file"
                                                name="file_id3"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={(event) => handleFileChange(event, student.registerNumber, 3)}
                                            />
                                        </div>

                                    </>
                                )}
                            </>
                        )}

                    </td>
                )}
                <td className="py-2 px-4 text-center">
                    <a href={`${server2}/documentButton/${student.file_id1}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 rounded inline-block transition duration-300 ease-in-out">Document 1</a>
                    <a href={`${server2}/documentButton/${student.file_id2}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 rounded inline-block transition duration-300 ease-in-out">Document 2</a>
                    <a href={`${server2}/documentButton/${student.file_id3}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 rounded inline-block transition duration-300 ease-in-out">Document 3</a>

                </td>
            </tr>
        ));
    };

    // Define the getStatusColor function here...
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text-green-500';
            case 'InProgress':
                return 'text-yellow-500';
            case 'declined':
                return 'text-red-500';
            default:
                return '';
        }
    };
    return (
        <>
            {isLoading && <LoadingScreen />}
            {showUnauthorizedPage && <UnauthorizedPage />}
            <Navbar />
            <div className=' space-x-auto mt-4'>
                <Toaster position="top-center" reverseOrder={false}></Toaster>
                <div className="flex justify-center space-x-4 mb-4">
                    <button onClick={() => handleFilterChange('All')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">All</button>
                    <button onClick={() => handleFilterChange('approved')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Approved</button>
                    <button onClick={() => handleFilterChange('InProgress')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">In Progress</button>
                    <button onClick={() => handleFilterChange('declined')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Declined</button>
                </div>
                <div className="max-w-screen-lg mx-auto overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-200">Name</th>
                                <th className="py-2 px-4 bg-gray-200">Department</th>
                                <th className="py-2 px-4 bg-gray-200">Status</th>
                                <th className="py-2 px-4 bg-gray-200">Year</th>
                                <th className="py-2 px-4 bg-gray-200">CGPA</th>
                                <th className="py-2 px-4 bg-gray-200">Backlogs</th>
                                <th className="py-2 px-4 bg-gray-200">Register No</th>
                                {(filter === 'All' || filter === 'InProgress') && <th className="py-2 px-4 bg-gray-200">Actions</th>}
                                <th className="py-2 px-4 bg-gray-200">Documents</th> {/* New table head */}
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StaffDashboard;
