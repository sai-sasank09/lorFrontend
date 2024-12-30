import React, { useEffect, useState, useCallback } from 'react';
import bgImage from '../assets/loginbg.jpg';
import Navbar from './Navbar';
import LoadingScreen from './Loader';
import axios from 'axios';
import Footer from "./footer";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaFileDownload } from 'react-icons/fa';

// import useTokenNavigation from '../middleware/auth';
// import Footer from './footer';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRegClipboard } from "react-icons/fa"; // FontAwesome icons
import { jwtDecode } from 'jwt-decode';
import { FaDownload } from 'react-icons/fa';

const steps = ['Personal Information','Academic Perfomance', 'University Details', 'Faculty Preferences', 'Upload Documents'];

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
        rollNo: '',
        branch: '',
        tenth:'',
        twelth:'',
        yearOfGraduation: '',
        mobileNumber: '',
        email: '',
        cgpa: '',
        // backlogs: '',
        appliedCountry: '',
        appliedUniversity: '',
        appliedCourse: '',
        prof1: '',
        prof2: '',
        prof3: '',
    });
    const [formDataToSend, setFormDataToSend] = useState(new FormData());
    const [showForm, setShowForm] = useState(true); // State to toggle between form and application details
    const [facultyList, setFacultyList] = useState([]);
    //added facultylist
    useEffect(() => {
        // Fetch the faculty list from the Flask backend
        fetch('http://127.0.0.1:5000/api/facultyList')  // Make sure this URL is correct
            .then(response => response.json())
            .then(data => {
                setFacultyList(data);
            })
            .catch(error => {
                console.error("Error fetching faculty list:", error);
            });
    }, []);
    // server's link 
    const server2 = 'http://127.0.0.1:5000'
    const server1 = 'https://lorbackend.onrender.com'

    const navigate = useNavigate();
    // const checkTokenAndNavigate = useTokenNavigation();

    useEffect(() => {
        const updatedFormDataToSend = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                updatedFormDataToSend.append(key, formData[key]);
            }
        }
        setFormDataToSend(updatedFormDataToSend);
    }, [formData]);



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
        // checkTokenAndNavigate();

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
    }, [fetchFile, navigate]);
    useEffect(() => {
        console.warn("Form Data Updated:", formData);
      }, [formData]);

      const handleFileChangeForProf = async (event, count, profEmail) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
    
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('studentId', registerNo_doc); // Include student ID in the form data
        formData.append('count', count); // Include count value for which draft document (prof1, prof2, prof3)
        formData.append('profEmail', profEmail); // Associate with specific professor
    
        try {
            const response = await axios.post(`${server2}/student/uploadForProf`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully: ', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // const handleFormSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true)
    //     try {

    //         if (registerNo_doc !== formData.registerNumber) {
    //             toast.error("Check the register number..!!");
    //             return
    //         }
    //         // Make a POST request to send form data to the server
    //         console.log("Before appending status:", formDataToSend);
        

    //     // Append status field to existing formDataToSend
    //     formDataToSend.append('status', 'pending');
    //     console.log("FormData before POST:");
    //         for (let pair of formDataToSend.entries()) {
    //             console.log(pair[0] + ', ' + pair[1]);
    //         }

    //         const response = await axios.post(`${server2}/student/dashboard`, formDataToSend, {
    //             headers: {
    //                 Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
    //             }
    //         });

    //         // handleUpload();
    //         console.warn(response.data); // Log the response from the server
    //         setApplicationSubmitted(true);
    //         // setApplicationDetailsOpen(false);

    //         if (response.status === 200) {
    //             // Handle successful submission
    //             // Close the form
    //             setShowForm(false);
    //         } else {
    //             // Handle other status codes if needed
    //             console.error('Unexpected status code:', response.status);
    //         }
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         // Handle error
    //     }
    //     finally {
    //         setIsLoading(false)
    //     }
    // };
    
    //updated handleformsubmit

    // const handleFormSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    
    //     try {
    //         if (registerNo_doc !== formData.registerNumber) {
    //             toast.error("Check the register number..!!");
    //             return;
    //         }
    
    //         const updatedFormData = new FormData();
    
    //         // Append fields to the FormData
    //         for (const key in formData) {
    //             if (formData.hasOwnProperty(key) && key !== 'prof1' && key !== 'prof2' && key !== 'prof3') {
    //                 updatedFormData.append(key, formData[key]);
    //             }
    //         }
    
    //         // Logic for appending professor names and emails
    //         const prof1 = facultyList.find(faculty => faculty.email === formData.prof1);
    //         const prof2 = facultyList.find(faculty => faculty.email === formData.prof2);
    //         const prof3 = facultyList.find(faculty => faculty.email === formData.prof3);
    
    //         if (prof1) {
    //             updatedFormData.append('prof1_name', prof1.name);
    //             updatedFormData.append('prof1_email', prof1.email);
    //         }
    //         if (prof2) {
    //             updatedFormData.append('prof2_name', prof2.name);
    //             updatedFormData.append('prof2_email', prof2.email);
    //         }
    //         if (prof3) {
    //             updatedFormData.append('prof3_name', prof3.name);
    //             updatedFormData.append('prof3_email', prof3.email);
    //         }
    
    //         updatedFormData.append('status', 'pending');
    
    //         console.log("Updated FormData before POST:");
    //         for (let pair of updatedFormData.entries()) {
    //             console.log(pair[0] + ', ' + pair[1]);
    //         }
    
    //         const response = await axios.post(`${server2}/student/dashboard`, updatedFormData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    
    //         if (response.status === 200) {
    //             // Assuming the server returns the updated form data including professor info
    //             setApplicationSubmitted(true);
    //             setShowForm(false);
    
    //             console.log(response.data);  // Log response for debugging
    //         } else {
    //             console.error("Unexpected status code:", response.status);
    //         }
    //     } catch (error) {
    //         console.error("Error submitting form:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    
    
    // useEffect(() => {
    //     console.warn(formData);  // Add this right before the form submission
    //     // Log the professors' selections
    // }, [formData]);
    const [professors, setProfessors] = useState([]);  // Initialize as an empty array

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        try {
          if (registerNo_doc !== formData.registerNumber) {
            toast.error("Check the register number..!!");
            return;
          }
      
          const updatedFormData = new FormData();
      
          // Append fields to the FormData
          for (const key in formData) {
            if (formData.hasOwnProperty(key) && key !== 'prof1' && key !== 'prof2' && key !== 'prof3') {
              updatedFormData.append(key, formData[key]);
            }
          }
      
          // Logic for appending professor names and emails
          const prof1 = facultyList.find(faculty => faculty.email === formData.prof1);
          const prof2 = facultyList.find(faculty => faculty.email === formData.prof2);
          const prof3 = facultyList.find(faculty => faculty.email === formData.prof3);
      
          if (prof1) {
            updatedFormData.append('prof1_name', prof1.name);
            updatedFormData.append('prof1_email', prof1.email);
          }
          if (prof2) {
            updatedFormData.append('prof2_name', prof2.name);
            updatedFormData.append('prof2_email', prof2.email);
          }
          if (prof3) {
            updatedFormData.append('prof3_name', prof3.name);
            updatedFormData.append('prof3_email', prof3.email);
          }
      
          updatedFormData.append('status', 'pending');
      
          const response = await axios.post(`${server2}/student/dashboard`, updatedFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.warn(response.data); 
          console.warn(response.status);
          console.log("Response data professors:", response.data.professors);  // Debug here
          setProfessors(response.data.professors);
      // Update professors with the received data
            
            console.warn(response.data);  // Log the response for debugging
        //   else {
        //     console.error("Unexpected status code:", response.status);
        //   }
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setIsLoading(false);
        }
      };
      useEffect(() => {
        console.warn("Updated professors:", professors);
    }, [professors]);
    

 
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  

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
    
    const handleDownload = async (fileId) => {
        const url = `${server2}/studentUploadedDocument/file_id${fileId}`;
        const storedToken = localStorage.getItem('token');
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedToken}`, // Include the JWT token in the Authorization header
                },
            });
    
            if (response.ok) {
                const fileUrl = await response.text(); // Assuming the response is the file URL
                console.log(fileUrl);
                if (fileUrl.includes('drive.google.com')) {
                    const fileWithEdit = `${fileUrl}/edit`;
                    // window.location.href = fileWithEdit; // Open the file in the same tab
                    window.open(fileWithEdit, '_blank');
                } else {
                    // If it's not a Google Drive link, just open it
                    window.location.href = fileUrl;
                }
            } else {
                console.error('Failed to download the file');
            }
        } catch (error) {
            console.error('Error during file download:', error);
        }
    };
    // Function to handle downloading drafts
    const handleDownloadDraft = async (draftType) => {
        const url = `${server2}/studentUploadedDocument/draft/${draftType}`;  // Updated URL structure for draft files
        const storedToken = localStorage.getItem('token');  // Retrieve the token from localStorage
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedToken}`,  // Include the JWT token in the Authorization header
                },
            });
    
            if (response.ok) {
                const fileUrl = await response.text();  // Assuming the response is just the file URL
                console.log(fileUrl);  // For debugging purposes
                if (fileUrl.includes('drive.google.com')) {
                    const fileWithEdit = `${fileUrl}/edit`;  // For Google Drive files, ensure you can edit
                    window.open(fileWithEdit, '_blank');  // Open Google Drive link in a new tab
                } else {
                    // If the file isn't hosted on Google Drive, just open it directly
                    window.location.href = fileUrl;
                }
            } else {
                console.error('Failed to download the file');
                alert('Failed to download the file. Please try again.');
            }
        } catch (error) {
            console.error('Error during file download:', error);
            alert('An error occurred. Please try again.');
        }
    };
    
  
    
    const handleViewDeanFile = async (fileId) => {
        const url = `${server2}/studentdocumentButton/DeanfileId${fileId}`; // fileId should be a key, not a full URL
        const storedToken = localStorage.getItem('token');
        console.log('from from end',fileId);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedToken}`, // Include the JWT token in the Authorization header
                },
            });
    
            if (response.ok) {
                const fileUrl = await response.text();
                console.log('Dean File URL:', fileUrl);
    
                if (fileUrl.includes('drive.google.com')) {
                    const fileWithEdit = `${fileUrl}/edit`;
                    window.open(fileWithEdit, '_blank');
                } else {
                    window.open(fileUrl, '_blank');
                }
            } else {
                const errorMessage = await response.json();
                console.error('Failed to retrieve the dean file:', errorMessage);
                alert(`Error: ${errorMessage.error || 'Failed to retrieve the file'}`);
            }
        } catch (error) {
            console.error('Error during dean file retrieval:', error);
            alert('An unexpected error occurred while retrieving the file.');
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
                    {/* updated the progress bar:) */}
                    <div className="mb-8 ml-2">
  <br></br>
  <div className="bg-gradient-to-r p-6 rounded-lg shadow-md max-w-md mx-auto hover:shadow-lg transition-shadow duration-200 ease-in-out">
  {/* Check the application status and display accordingly */}
  {formData.DeanfileId3 ? (
    // Approved status (No reason shown here)
    <div className="flex items-start text-green-600">
      <FaCheckCircle size={28} className="mr-3" />
      <div>
        <p className="font-semibold text-lg">Application Status: <strong>Approved</strong></p>
      </div>
    </div>
  ) : formData.status === 'approved' ? (
    // Initial Approval status (No reason shown here)
    <div className="flex items-start text-yellow-600">
      <FaExclamationTriangle size={28} className="mr-3" />
      <div>
        <p className="font-semibold text-lg">Application Status: <strong>Initial Approval</strong></p>
      </div>
    </div>
  ) : formData.status === 'declined' ? (
    // Declined status (Show reason)
    <div className="flex items-start text-red-600">
      <FaTimesCircle size={28} className="mr-3" />
      <div>
        <p className="font-semibold text-lg">Application Status: <strong>Declined</strong></p>
        {formData.reason && (
          <p className="text-sm mt-2 text-gray-600">Reason: <span className="italic">{formData.reason}</span></p>
        )}
      </div>
    </div>
  ) : applicationSubmitted ? (
    // Submitted status (No reason shown here)
    <div className="flex items-start text-blue-600">
      <FaRegClipboard size={28} className="mr-3" />
      <div>
        <p className="font-semibold text-lg">Application Status: <strong>Submitted</strong></p>
      </div>
    </div>
  ) : (
    // Not Applied status (No reason shown here)
    <div className="flex items-start text-gray-600">
      <FaRegClipboard size={28} className="mr-3" />
      <div>
        <p className="font-semibold text-lg">Application Status: <strong>Not Applied</strong></p>
      </div>
    </div>
  )}
</div>

</div>
                {/* </div> */}
                {/* Application Status Section */}



                {/* <div className="flex justify-center items-center max-h-screen"> */}

                {showForm && (
                <div className="flex justify-center items-center max-h-screen">

                    
<div className="bg-white w-full max-w-[1200px] h-[568px] border border-gray-400 rounded-md flex flex-col md:flex-row mx-auto px-4 overflow-hidden">
    <div
        className="bg-gray-200 w-full md:w-[274px] rounded-md mb-3 md:mt-2 md:ml-2 md:mb-2"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
                                <StepIndicator currentStep={currentStep} />
                            </div>

                            <div className="w-full md:w-3/4 md:ml-10 md:mt-6 overflow-y-auto flex flex-col" >
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
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Other input fields */}
                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                            <div className="">
                                                    <div><label htmlFor="rollNo" className="block mb-1 font-mono font-medium text-blue-900">Roll Number:</label>
                                                        <input
                                                            // type="number"
                                                            id="rollNo"
                                                            name="rollNo"
                                                            value={formData.rollNo}
                                                            onChange={handleChange}
                                                            placeholder="Enter Your Roll Number"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div><label htmlFor="department" className="block mb-1 font-mono text-blue-900 font-medium">Department:</label>
                                                        <input
                                                            type="text"
                                                            id="department"
                                                            name="department"
                                                            value={formData.department}
                                                            onChange={handleChange}
                                                            placeholder="Department"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                               
                                            </div>
                                           


                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                            <div className="">
                                                    <div><label htmlFor="branch" className="block mb-1 font-mono text-blue-900 font-medium">Branch:</label>
                                                        <input
                                                            type="text"
                                                            id="branch"
                                                            name="branch"
                                                            value={formData.branch}
                                                            onChange={handleChange}
                                                            placeholder="branch"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                           
                                                <div className="">
                                                    <div> <label htmlFor="email" className="block mb-1 font-mono font-medium text-blue-900">Email:</label>
                                                        <input
                                                            type="text"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="Enter your mail id"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>



                                            <div className="flex md:flex-row justify-center items-center md:justify-around flex-col">
                                            <div className="">
                                                <div>
                                                    <label htmlFor="yearOfGraduation" className="block mb-1 font-mono text-blue-900 font-medium">
                                                        Year of Graduation:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="yearOfGraduation"
                                                        name="yearOfGraduation"
                                                        value={formData.yearOfGraduation || ''}  // Ensure value is not undefined
                                                        onChange={handleChange}
                                                        placeholder="Year of Graduation"
                                                        required
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
                                                            required
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
                                               <p className="text-sm text-neutral-500 mb-8">
        Please provide details about your academic performance including 10th percentage, 12th percentage, and current CGPA.
    </p>
                                            {/* <p className="text-sm text-neutral-500  mb-8">Please provide information about the country you have applied to, <br /> the course you are interested in, and the university you prefer.</p> */}
                                            <div className=''></div>
                                       <div className='pb-10'>
                                       <div><label htmlFor="tenth" className="block mb-1 font-mono text-blue-900 font-medium">10th Percentage:</label>
                                           <input
                                               type="text"
                                               id="tenth"
                                               name="tenth"
                                               value={formData.tenth}
                                               onChange={handleChange}
                                               placeholder="Enter Your Percentage"
                                               required
                                               className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                               style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                           />
                                       </div>

                                                <div className='pb-10'>
                                                    <div><label htmlFor="twelth" className="block mb-1 font-mono text-blue-900 font-medium">12th Percentage:</label>
                                                        <input
                                                            type="text"
                                                            id="twelth"
                                                            name="twelth"
                                                            value={formData.twelth}
                                                            onChange={handleChange}
                                                            placeholder="Enter Your Percentage"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                    <div><label htmlFor="cgpa" className="block mb-1 font-mono text-blue-900 font-medium">CGPA:</label>
                                                        <input
                                                            type="text"
                                                            id="cgpa"
                                                            name="cgpa"
                                                            value={formData.cgpa}
                                                            onChange={handleChange}
                                                            placeholder="Enter your CGPA"
                                                            required
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div>
                                                    {/* <div><label htmlFor="backlogs" className="block mb-1 font-mono text-blue-900 font-medium">Backlogs:</label>
                                                        <input
                                                            type="text"
                                                            id="backlogs"
                                                            name="backlogs"
                                                            value={formData.backlogs}
                                                            onChange={handleChange}
                                                            placeholder="No of Backlogs"
                                                            className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                            style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                        />
                                                    </div> */}
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
                                            <h2 className="text-3xl text-blue-950  font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <p className="text-sm text-neutral-500  mb-8">Please provide information about the country you have applied to, <br /> the course you are interested in, and the university you prefer.</p>
                                            <div className=''>

                                            <div>
    <label
        htmlFor="appliedCountry"
        className="block mb-1 font-mono text-blue-900 font-medium"
    >
        Applied Country:
    </label>
    <select
        id="appliedCountry"
        name="appliedCountry"
        value={formData.appliedCountry}
        required
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
        style={{ maxWidth: '200px', height: '40px', minHeight: '40px', resize: 'none' }}
    >
        <option value="">Select a country</option>
        <option value="US">United States</option>
        <option value="UK">United Kingdom</option>
        <option value="AUS">Australia</option>
        <option value="NZ">New Zealand</option>
        <option value="S'PORE">Singapore</option>
        <option value="GERMANY">Germany</option>
        <option value="SWEDAN">Sweden</option>
        <option value="CANADA">Canada</option>
        <option value="OTHERS">Others</option>
    </select>
</div>

                                                <div className='pb-10'>
                                                    <div><label htmlFor="appliedCourse" className="block mb-1 font-mono text-blue-900 font-medium">Course Interested:</label>
                                                        <input
                                                            type="text"
                                                            id="appliedCourse"
                                                            name="appliedCourse"
                                                            value={formData.appliedCourse}
                                                            onChange={handleChange}
                                                            required
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
                                                            required
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

{currentStep === 4 && (
    <div className="w-full md:w-3/4 md:ml-10 md:mt-6 overflow-y-auto flex flex-col">
        <h2 className="text-3xl text-blue-950 font-bold mb-4">{steps[currentStep - 1]}</h2>
        <p className="text-sm text-neutral-500 mb-8">Please select your preferred faculty options.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Faculty 1 Dropdown and File Upload */}
            <div className="form-group">
                <label htmlFor="prof1" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 1:</label>
                <select
                    id="prof1"
                    name="prof1"
                    value={formData.prof1}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
                    style={{ maxWidth: '100%' }}
                >
                    <option value="">Select Faculty 1</option>
                    {facultyList.map((faculty, index) => (
                        <option key={index} value={faculty.email}>{faculty.name}</option>
                    ))}
                </select>

                <label htmlFor="document1" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 1 Draft:</label>
                <input
                    id="document1"
                    type="file"
                    name="file_id1"
                    onChange={(event) => handleFileChangeForProf(event, 1, formData.prof1)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
            </div>

            {/* Faculty 2 Dropdown and File Upload */}
            <div className="form-group">
                <label htmlFor="prof2" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 2:</label>
                <select
                    id="prof2"
                    name="prof2"
                    value={formData.prof2}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
                    style={{ maxWidth: '100%' }}
                >
                    <option value="">Select Faculty 2</option>
                    {facultyList.map((faculty, index) => (
                        <option key={index} value={faculty.email}>{faculty.name}</option>
                    ))}
                </select>

                <label htmlFor="document2" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 2 Draft:</label>
                <input
                    id="document2"
                    type="file"
                    name="file_id2"
                    onChange={(event) => handleFileChangeForProf(event, 2, formData.prof2)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
            </div>

            {/* Faculty 3 Dropdown and File Upload */}
            <div className="form-group">
                <label htmlFor="prof3" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 3:</label>
                <select
                    id="prof3"
                    name="prof3"
                    value={formData.prof3}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
                    style={{ maxWidth: '100%' }}
                >
                    <option value="">Select Faculty 3</option>
                    {facultyList.map((faculty, index) => (
                        <option key={index} value={faculty.email}>{faculty.name}</option>
                    ))}
                </select>

                <label htmlFor="document3" className="block mb-1 font-mono text-blue-900 font-medium">Faculty 3 Draft:</label>
                <input
                    id="document3"
                    type="file"
                    name="file_id3"
                    onChange={(event) => handleFileChangeForProf(event, 3, formData.prof3)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                />
            </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between lg:px-20 sm:px-4 mt-8">
            <button
                type="button"
                onClick={prevStep}
                className="text-neutral-400 font-semibold py-2 px-6 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
            >
                Go Back
            </button>
            <div className='flex justify-end'>
                <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-900 text-gray-100 font-semibold py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
                >
                    Next Step
                </button>
            </div>
        </div>
    </div>
)}



                                    {currentStep === 5 && (
                                        <div>
                                            <h2 className="text-3xl text-blue-950 font-bold mb-2">{steps[currentStep - 1]}</h2>
                                            <div><p className="text-sm text-neutral-500  mb-8">Please upload your GRE, IELTS and other necessary documents.</p>

                                                <label htmlFor="document1" className="block mb-1 font-mono text-blue-900 font-medium">GRE:</label>

                                                <input
                                                    // required
                                                    id="document1"
                                                    type="file"
                                                    name="file_id1"
                                                    onChange={(event) => handleFileChange(event, 1)}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    className=" border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                                                    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
                                                />

<label htmlFor="document2" className="block mb-1 font-mono text-blue-900 font-medium">TOEFL/IELTS/PTE:</label>

<input
    // required
    id="document2"
    type="file"
    name="file_id2"
    onChange={(event) => handleFileChange(event, 2)}
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    className=" border border-gray-300 rounded px-2 py-1 mb-2 w-full"
    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
/>
<label htmlFor="document3" className="block mb-1 font-mono text-blue-900 font-medium">GMAT/DUOLINGO:</label>

<input
    // required
    id="document3"
    type="file"
    name="file_id3"
    onChange={(event) => handleFileChange(event, 3)}
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    className=" border border-gray-300 rounded px-2 py-1 mb-2 w-full"
    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
/>
<label htmlFor="document4" className="block mb-1 font-mono text-blue-900 font-medium">GATE:</label>

<input
    // required
    id="document4"
    type="file"
    name="file_id4"
    onChange={(event) => handleFileChange(event, 4)}
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    className=" border border-gray-300 rounded px-2 py-1 mb-2 w-full"
    style={{ maxWidth: '250px', height: '40px', minHeight: '40px', resize: 'none' }}
/>
                                                </div>


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
                        </div>
                        
                    )}
               {applicationSubmitted && !showForm && (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mx-auto my-6 max-w-6xl flex">
    <div className="flex-1 mr-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Application Details</h2>
      </div>

      {/* Display application details */}
      <div className="text-gray-700">
        <ul className="space-y-4">
          <li><strong>Register Number:</strong> {formData.registerNumber}</li>
          <li><strong>Department:</strong> {formData.department}</li>
          <li><strong>Course:</strong> {formData.course}</li>
          <li><strong>Year of Graduation:</strong> {formData.yearofGraduation}</li>
          <li><strong>Mobile Number:</strong> {formData.mobileNumber}</li>
          <li><strong>CGPA:</strong> {formData.cgpa}</li>
          <li><strong>Backlogs:</strong> {formData.backlogs}</li>
          <li><strong>Applied Country:</strong> {formData.appliedCountry}</li>
          <li><strong>Applied University:</strong> {formData.appliedUniversity}</li>
          <li><strong>Applied Course:</strong> {formData.appliedCourse}</li>
          <li><strong>Professor 1:</strong> {formData.prof1_name}</li>
          <li><strong>Professor 2:</strong> {formData.prof2_name}</li>
          <li><strong>Professor 3:</strong> {formData.prof3_name}</li>
        </ul>
      </div>

      {/* Uploaded Files Section */}
      <div className="flex flex-col mt-6">
        {formData.file_id1 && (
          <>
            <span className="text-xl font-semibold mb-2">Uploaded Files</span>
            <div className="mt-4">
              <button
                onClick={() => handleDownload(1)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
              >
                <FaDownload className="mr-2" /> Uploaded Document 1
              </button>
            </div>
          </>
        )}
        {formData.file_id2 && (
          <div className="mt-4">
            <button
              onClick={() => handleDownload(2)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
            >
              <FaDownload className="mr-2" /> Uploaded Document 2
            </button>
          </div>
        )}
        {formData.file_id3 && (
          <div className="mt-4">
            <button
              onClick={() => handleDownload(3)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
            >
              <FaDownload className="mr-2" /> Uploaded Document 3
            </button>
          </div>
        )}
      </div>

      {/* Professor Draft Files Section */}
      <div className="flex flex-col mt-6">
        <span className="text-xl font-semibold mb-2">Professor Draft Documents</span>
        
        {/* Draft for Professor 1 */}
        {formData.prof1_draft && (
          <div className="mt-4">
            <button
              onClick={() => handleDownloadDraft(1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
            >
              <FaFileDownload className="mr-2" /> Draft Document for Professor 1
            </button>
          </div>
        )}

        {/* Draft for Professor 2 */}
        {formData.prof2_draft && (
          <div className="mt-4">
            <button
              onClick={() => handleDownloadDraft(2)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
            >
              <FaFileDownload className="mr-2" /> Draft Document for Professor 2
            </button>
          </div>
        )}

        {/* Draft for Professor 3 */}
        {formData.prof3_draft && (
          <div className="mt-4">
            <button
              onClick={() => handleDownloadDraft(3)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300 w-full sm:w-auto"
            >
              <FaFileDownload className="mr-2" /> Draft Document for Professor 3
            </button>
          </div>
        )}
      </div>

      {/* Delete Application button */}
      {formData.status !== 'approved' && (
        <div className="mt-6">
          <button
            onClick={handleDeleteApplicationClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
          >
            Delete Application
          </button>
        </div>
      )}
    </div>

    <div className="hidden lg:block flex-none w-1/3 bg-gray-200 rounded-lg p-6 shadow-lg">
      <div className="flex justify-center items-center h-full">
        <div className="w-24 h-24 bg-blue-300 rounded-full flex justify-center items-center text-white font-bold text-xl">
          This will display only on large screens and above
        </div>
      </div>
    </div>
  </div>
)}

                    
                   
                </div>
            </div>
            <Footer />
        </>
    );
};

export default WhiteRectangle;
