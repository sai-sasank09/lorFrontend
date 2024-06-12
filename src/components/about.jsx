import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import Footer from "./footer";
import axios from 'axios';
import convertToBase64 from './../helper/convert'
import { useNavigate } from 'react-router-dom';
import useTokenNavigation from '../middleware/auth';
import LoadingScreen from './Loader';






const About = () => {

    // Move the AnimatedInstructionItem component inside the About component
    const AnimatedInstructionItem = ({ number, heading, description, style, animationDirection }) => {
        const [animate, setAnimate] = useState(false);

        useEffect(() => {
            // Trigger animation after component mounts
            setAnimate(true);
        }, []);

        return (
            <div className={`flex items-center space-x-2 mt-2 transition-transform duration-500 ease-out transform ${animate ? (animationDirection === 'left' ? '-translate-x-full' : '-translate-x-0') : 'translate-x-0'}`} style={style}>
                <div className="text-2xl text-rose-900 font-bold transform -rotate-90 relative">
                    <div className="flex items-center">
                        <div className="border-b border-rose-900 mr-3 w-8"></div>
                        {number}
                    </div>
                </div>
                <div >
                    <div className="text-lg text-blue-900 font-bold uppercase mt-8" style={{ maxWidth: "290px" }}>{heading}</div>
                    <div className="text-sm mt-1" style={{ maxWidth: "290px", whiteSpace: "pre-wrap" }}>{description}</div>
                </div>
            </div>
        );
    };

    const slides = [
        {
            url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
        },
        {
            url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
        },
        {
            url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
        },
        {
            url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
        },
        {
            url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);


    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [applicationDetailsOpen, setApplicationDetailsOpen] = useState(false);
    const [applicationDocumentOpen, setApplicationDocumentOpen] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState();
    const checkTokenAndNavigate = useTokenNavigation();
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

    useEffect(() => {
        checkTokenAndNavigate();
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const storedToken = localStorage.getItem('token');
                console.log(storedToken)
                if (storedToken) {
                    setToken(storedToken);
                }
                const res = await axios.post("http://127.0.0.1:5000/student/dashboard/getData", {}, {
                    headers: {
                        Authorization: `Bearer ${storedToken}` // Include the JWT token in the Authorization header
                    }
                });
                const data = res.data;
                console.warn(data);
                if (data && data.registerNumber) {
                    setApplicationSubmitted(true);
                    setApplicationDetailsOpen(false);
                    setFormData(data); // set form data if available
                    console.log(data.status)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, []);


    // State to store form data to send to the server
    const [formDataToSend, setFormDataToSend] = useState(new FormData());

    const handleApplyNowClick = () => {
        navigate(`/student/dashboard`);
    };
    const navigate = useNavigate()
    const handleCancelClick = () => {
        setApplicationDetailsOpen(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {


            // Make a POST request to send form data to the server
            formDataToSend.append('status', 'pending'); // Ensure status is sent with form data
            console.log(formDataToSend)
            const response = await axios.post('http://127.0.0.1:5000/student/dashboard', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
                }
            });
            console.warn(response.data); // Log the response from the server
            setApplicationSubmitted(true);
            setApplicationDetailsOpen(false);
            if (response.status === 200) {
                // Handle successful submission
                // Close the form
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
    const handleFileChange = async e => {
        const name = e.target.name; // Get the name of the input element
        const base64 = await convertToBase64(e.target.files[0]);
        setFormData({
            ...formData,
            [name]: base64, // Set the base64 data to the corresponding property in formData
        });
        formDataToSend.set(name, base64);
    };

    const handleDeleteApplicationClick = async () => {
        setIsLoading(true)
        try {
            // Assuming you have the registerNumber stored in the form data
            const register_Number = formData.registerNumber; // Retrieve register number from form data

            // Send a DELETE request to the server
            const response = await axios.delete('http://127.0.0.1:5000/student/dashboard/delete', {
                data: { registerNumber: register_Number } // Sending the register number to identify the application
            });

            console.log(response.data);
            setApplicationSubmitted(false);
            setApplicationDetailsOpen(false);

        } catch (error) {
            console.error('Error deleting application:', error);
            // Handle error
        }
        finally {
            setIsLoading(false)
        }
    };

    const handleViewDocumentClick = () => {
        setApplicationDocumentOpen(true); // Open application details to view documents
    };


    return (
        <>
            <Navbar />
            <div className="bg-stone-300 absolute h-[729px] inset-0"></div>
            <div className='max-w-[1100px] h-[600px] w-full m-auto py-10 px-4 relative group'>
                <div
                    style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                    className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
                ></div>
                {/* Left Arrow */}
                <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                    <BsChevronCompactLeft onClick={prevSlide} size={30} />
                </div>
                {/* Right Arrow */}
                <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                    <BsChevronCompactRight onClick={nextSlide} size={30} />
                </div>
                <div className='flex top-4 justify-center py-2'>
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className='text-2xl cursor-pointer'
                        >
                            <RxDotFilled />
                        </div>
                    ))}
                </div>
            </div>
            {/* Instructions Section */}
            <div className="mt-10 text-center text-gray-600 mb-20">
                <div className="bg-green-100 p-4 rounded-lg mb-4 max-w-[1000px] m-auto">
                    <p className="text-lg">Dear Student,</p>
                    <p className="text-lg">Congratulations on your decision to pursue higher education! As part of your application process, you may need letters of recommendation. Here's a guide to help you through the process:</p>
                </div>

                <h2 className="text-2xl font-semibold mb-14 text-gray-600">How it works</h2>
                <AnimatedInstructionItem
                    number="01"
                    heading="Faculty Preferences"
                    description="Identify potential recommenders who are familiar with your academic or potential achievements."
                    style={{ marginLeft: "20%" }}
                    animationDirection="right" // Change animation direction as needed
                />
                <AnimatedInstructionItem
                    number="02"
                    heading="Request permission and provide information"
                    description="Contact potential recommenders and share your resume, transcripts, and program details to request their recommendation."
                    style={{ marginLeft: "48%", marginTop: "1px" }}
                    animationDirection="right" // Change animation direction as needed
                />
                <AnimatedInstructionItem
                    number="03"
                    heading="Allow time and follow up"
                    description="Ensure your recommenders have enough time to write a thoughtful recommendation. Politely follow up if necessary, but respect their time and constraints."
                    style={{ marginLeft: "28%", marginTop: "40px" }}
                    animationDirection="right" // Change animation direction as needed
                />
                <AnimatedInstructionItem
                    number="04"
                    heading="Express Gratitude"
                    description="Once you receive the recommendation, promptly thank your recommenders for their support."
                    style={{ marginLeft: "55%", marginTop: "1px" }}
                    animationDirection="right" // Change animation direction as needed
                />
            </div>

            <div className="flex justify-center items-center h-full">
                <div>
                    <button onClick={handleApplyNowClick} className="bg-gray-500 text-white font-semibold py-2 px-4 md:mb-8 mb-8 rounded mt-2">Apply Now</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
