import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import LoadingScreen from './skelition';
import UnauthorizedPage from './UnauthorizedPageStaff';
import { darken } from 'polished';

const StudentDetailsCard = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [openDeleteMap, setOpenDeleteMap] = useState({});
    const [studentsPerPage] = useState(8);
    const [selectedStudent, setSelectedStudent] = useState(null);
    // const [searchResults, setSearchResults] = useState([]);
    const [visitedCards, setVisitedCards] = useState([]);
    const [showUnauthorizedPage, setShowUnauthorizedPage] = useState(false);


    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'


    useEffect(() => {
        fetchStudentData();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset the page when the filter changes
    }, [filter]);

    const fetchStudentData = async () => {
        try {
            setIsLoading(true);
            const storedTokenStaff = localStorage.getItem('token_staff');
            const response = await axios.get(`${server2}/staff/studentCard`, {
                headers: {
                    Authorization: `Bearer ${storedTokenStaff}`,
                },
            });

            const allStudents = response.data;

            // Separate students based on criteria
            const unvisitedStudents = allStudents.filter((student) => !student.Visited);
            const visitedNotApproved = allStudents.filter(
                (student) => student.Visited && student.status !== 'approved'
            );
            const approvedStudents = allStudents.filter((student) => student.status === 'approved');

            // Concatenate the lists to create the desired order
            const orderedStudents = [...unvisitedStudents, ...visitedNotApproved, ...approvedStudents];

            setStudents(orderedStudents);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setShowUnauthorizedPage(true);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const getFilteredStudents = () => {
        return students.filter((student) => {
            const matchesSearch =
                (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (student.registerNumber && student.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFilter =
                filter === 'All' ||
                (filter === 'approved' && student.status === 'approved') ||
                (filter === 'InProgress' && student.status !== 'approved' && student.status !== 'declined') ||
                (filter === 'declined' && student.status === 'declined');

            return matchesSearch && matchesFilter;
        });
    };

    const filteredStudents = getFilteredStudents();

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);



    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };



    const renderPageNumbers = () => {
        return (
            <div className="join">
                <button
                    className={`join-item btn ${currentPage === 1 ? 'btn-disabled' : ''}`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    «
                </button>
                <button
                    className="join-item btn"
                >
                    Page {currentPage}
                </button>
                <button
                    className={`join-item btn ${currentPage === totalPages ? 'btn-disabled' : ''}`}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    »
                </button>
            </div>
        );
    };

    const updateStudentStatus = async (_id, newStatus) => {
        setIsLoading(true);
        try {
            await axios.put(`${server2}/students/${_id}`, { status: newStatus });
            fetchStudentData(); // Refresh student data after successful update
        } catch (error) {
            console.error('Error updating student status:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateStudentStatusApproved = async (_id, newStatus) => {
        setIsLoading(true);
        try {
            await axios.put(`${server2}/students/${_id}`, { status: newStatus });
            await fetchStudentData();// Refresh student data after successful update
            // window.location.reload();
        } catch (error) {
            console.error('Error updating student status:', error);
        }
        finally {
            setIsLoading(false);
        }

    };
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


    const closeStudentDetails = () => {
        setSelectedStudent(null);
    };
    const handleViewMoreClick = async (student) => {
        try {
            // Add the card ID to the list of visited cards
            setVisitedCards((prevVisitedCards) => [...prevVisitedCards, student._id]);

            // Make an Axios POST request to mark the student as visited
            const response = await axios.post(`${server2}/dean/visited`, {
                studentId: student._id,
            });

            if (response.status === 200) {
                console.log('Visited status updated successfully');
            } else {
                console.warn('Unexpected response status:', response.status);
            }

            // Set the selected student for the view more action
            setSelectedStudent(student);
        } catch (error) {
            console.error('Error marking student as visited:', error);  // Improved error handling
            console.error('Error details:', error.response?.data);  // Detailed error message
        }
    };

    const colors = [
        '#F0E68C', // Khaki
        '#FFBE98',  //light orange
        '#FFB6C1', // Light Pink
        '#B0E0E6', // Powder Blue
        '#7BD3EA', // Light Blue
        '#B7C9F2', //light purple
        '#76ABAE', //dark green
        '#F5DEB3', // Wheat

        '#FFC5C5', //salmon pink
        '#FFB6C1', // Light Pink
        '#ADD8E6', // Light Blue
    ];

    return (
        <>
            {showUnauthorizedPage && <UnauthorizedPage />}
            {isLoading && <LoadingScreen />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />
                    <div className="container mx-auto lg:px-32 flex-grow">
                        <h1 className="text-3xl font-bold text-center mb-4 pt-4">Student Details</h1>
                        <div className="join flex justify-end mb-4">
                            <input
                                className="input input-bordered join-item"
                                type="text"
                                placeholder="Search documents or Register Number"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select
                                className="select select-bordered join-item"
                                onChange={(e) => handleFilterChange(e.target.value)}
                            >
                                <option disabled selected>Filter</option>
                                <option value="All">All</option>
                                <option value="approved">Approved</option>
                                <option value="InProgress">In Progress</option>
                                <option value="declined">Declined</option>
                            </select>
                            <button
                                className="btn join-item"
                                onClick={() => console.log("Search")}
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                {currentStudents.map((student, index) => (
                                    <div key={student._id} className="bg-neutral-100 rounded-lg overflow-hidden shadow-md w-72 h-60 relative">
                                        <div
                                            className="absolute inset-y-0 right-0.5 w-8 bg-amber-300 rounded-r-lg"
                                            style={{ backgroundColor: colors[index % colors.length] }}
                                        ></div>
                                        <div
                                            className="absolute right-0.5 top-0.5 bg-amber-400 w-8 h-14 rounded-tr-lg flex justify-center items-center"
                                            style={{ backgroundColor: darken(0.1, colors[index % colors.length]) }}
                                        >
                                            <span className="text-white font-bold font-sans">{index + 1 + (currentPage - 1) * studentsPerPage}</span>
                                        </div>

                                        {/* Conditionally render the "New" indicator if the card hasn't been visited */}
                                        <span className=" mx-4 mt-4 ">
                                            {!student.Visited && !visitedCards.includes(student._id) && (
                                                <span className='indicator-item badge badge-secondary'>New</span>
                                            )}
                                        </span>


                                        <div className="ml-4 mt-2">
                                            <p className="text-md font-bold uppercase mb-4">
                                                <span style={{ borderBottom: '1px solid #000', display: 'inline', paddingBottom: '1px', wordWrap: 'break-word' }}>{student.name}</span>
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Register Number:</strong> {student.registerNumber}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Course:</strong> {student.course}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Department:</strong> {student.department}
                                            </p>
                                            <p>
                                                <strong className="text-gray-800">Status:</strong> {student.status}
                                            </p>
                                            <div className="mt-4 flex justify-start">
                                                <button
                                                    onClick={() => handleViewMoreClick(student)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                                >
                                                    View More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {selectedStudent && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                <div className="bg-white rounded-lg overflow-hidden shadow-md p-6 w-full md:w-1/2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                                        <button onClick={closeStudentDetails} className="text-gray-500 hover:text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p><strong>Register Number:</strong> {selectedStudent.registerNumber}</p>
                                    <p><strong>Course:</strong> {selectedStudent.course}</p>
                                    <p><strong>Department:</strong> {selectedStudent.department}</p>
                                    <p><strong>Mobile Number:</strong> {selectedStudent.mobileNumber}</p>
                                    <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
                                    <p><strong>Year of Graduation:</strong> {selectedStudent.yearofGraduation}</p>
                                    <p><strong>Backlogs:</strong> {selectedStudent.backlogs}</p>
                                    <p><strong>Applied University:</strong> {selectedStudent.appliedUniversity}</p>
                                    <p><strong>Applied Course:</strong> {selectedStudent.appliedCourse}</p>
                                    <p><strong>Professor 1:</strong> {selectedStudent.prof1}</p>
                                    <p><strong>Professor 2:</strong> {selectedStudent.prof2}</p>
                                    <p><strong>Professor 3:</strong> {selectedStudent.prof3}</p>
                                    <strong className='font-bold'>Documents List: </strong>
                                    <a href={`${server2}/documentButton/${selectedStudent.file_id1}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 mx-2 rounded inline-block transition duration-300 ease-in-out">Document 1</a>
                                    <a href={`${server2}/documentButton/${selectedStudent.file_id2}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 mx-2 rounded inline-block transition duration-300 ease-in-out">Document 2</a>
                                    <a href={`${server2}/documentButton/${selectedStudent.file_id3}`} class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 my-2 mx-2 rounded inline-block transition duration-300 ease-in-out">Document 3</a>
                                    {selectedStudent.status === 'pending' && (
                                        <div className="flex justify-end mt-4">
                                            <button onClick={() => updateStudentStatusApproved(selectedStudent._id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2">Approve</button>
                                            <button onClick={() => updateStudentStatus(selectedStudent._id, 'declined')} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Decline</button>
                                        </div>
                                    )}

                                    {selectedStudent.status === 'approved' && (
                                        <>
                                            {openDeleteMap[selectedStudent.registerNumber] ? (
                                                <button onClick={() => handleDeleteDocument(selectedStudent.registerNumber)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Delete Document</button>
                                            ) : (
                                                <>
                                                    <div className="mb-4">
                                                        <h3>Upload the file</h3>
                                                        <input
                                                            type="file"
                                                            name="file_id1"
                                                            accept=".pdf,.doc,.docx,.txt"
                                                            onChange={(event) => handleFileChange(event, selectedStudent.registerNumber, 1)}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <h3>Upload the file</h3>
                                                        <input
                                                            type="file"
                                                            name="file_id2"
                                                            accept=".pdf,.doc,.docx,.txt"
                                                            onChange={(event) => handleFileChange(event, selectedStudent.registerNumber, 2)}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <h3>Upload the file</h3>
                                                        <input
                                                            type="file"
                                                            name="file_id3"
                                                            accept=".pdf,.doc,.docx,.txt"
                                                            onChange={(event) => handleFileChange(event, selectedStudent.registerNumber, 3)}
                                                        />
                                                    </div>

                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center">
                            {renderPageNumbers()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDetailsCard;
