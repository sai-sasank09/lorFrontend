import React, { useState } from 'react';
import Navbar from './Navbar';
// import Footer from './footer';
import axios from 'axios';

const ApprovedListPage = () => {
    // State to manage the approved list
    const [approvedList, setApprovedList] = useState([]);
    const [year, setYear] = useState('');
    const [error, setError] = useState('');

    const server2 = "http://127.0.0.1:5000"
    // const server2 = "https://lorbackend.onrender.com"
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.get(`${server2}/staff/filterStudents/${year}`); // Assuming your backend API endpoint is /api/data
            setApprovedList(response.data); // Assuming the response from backend contains the approved list for the entered year
            setError('');
        } catch (error) {
            setError('Error fetching data. Please try again.'); // Handle error if request fails
        }
    };

    // Function to download the data as CSV
    const downloadCSV = () => {
        // Exclude '_id' field from the list of keys
        const keys = Object.keys(approvedList[0]).filter(key => key !== '_id');
        const csvContent = "data:text/csv;charset=utf-8," +
            ['S.No', ...keys].join(",") + "\n" +
            approvedList.map((row, index) => {
                // Exclude '_id' value from the row and map only relevant fields
                return `${index + 1},${keys.map(key => row[key]).join(",")}`;
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "approved_list.csv");
        document.body.appendChild(link);
        link.click();
    };



    return (
        <>
            <Navbar />
            <div className="container h-[75vh]  mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4">Approved List</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex">
                        <input
                            className="border border-gray-300 rounded-l-md py-2 px-4 mr-2 focus:outline-none focus:ring focus:border-blue-500 flex-grow"
                            type="text"
                            name="year"
                            placeholder="Enter year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:ring focus:border-blue-500" type="submit">
                            Search
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {approvedList.length > 0 &&
                    <div className="mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-500" onClick={downloadCSV}>
                            Download CSV
                        </button>
                        <div className='p-4 w-full max-w-screen-2xl mx-auto rounded-md flex-col overflow-x-auto lg:overflow-auto'>
                            <div className='max-h-[calc(60vh-8rem)] xl:max-h-full'>
                                <table className="mt-4 w-full table-auto border-collapse h-[50vh] overflow-y-scroll border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 bg-gray-200 text-gray-700 rounded-tl-2xl">S.No</th>
                                            <th className="px-4 py-2 bg-gray-200 text-gray-700">Student Name</th>
                                            <th className="px-4 py-2 bg-gray-200 text-gray-700">Register Number</th>
                                            <th className="px-4 py-2 bg-gray-200 text-gray-700">Year of Graduation</th>
                                            <th className="px-4 py-2 bg-gray-200 text-gray-700  rounded-tr-xl">Applied Country</th>
                                            {/* Add more table headers for other relevant details */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {approvedList.map((student, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                                <td className="text-center px-4 py-2">{index + 1}</td>
                                                <td className="text-center px-4 py-2">{student.student_name}</td>
                                                <td className="text-center px-4 py-2">{student.register_number}</td>
                                                <td className="text-center px-4 py-2">{student.year_of_graduation}</td>
                                                <td className="text-center px-4 py-2">{student.applied_country}</td>
                                                {/* Render other relevant details in table cells */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default ApprovedListPage;
