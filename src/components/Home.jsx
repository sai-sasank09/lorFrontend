import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

const Home = () => {
    const navigate = useNavigate();

    const handleSubmission = (e) => {
        e.preventDefault();
        navigate('/login'); // Assuming this is the route for the application form
    };

    return (
        <>
            <Navbar />

            <div className="loginbg md:px-0 z-10 relative bg-opacity-70">
                <div className='border p-6 bg-white md:bg-opacity-80 bg-opacity-70 backdrop-filter rounded-lg shadow-lg z-10 font-semibold'>

                    <p className="font-bold flex items-center justify-center text-xl">Letter of Recommendation Submission</p><br />

                    <p className="font-semibold text-base">Dear Student,</p>
                    <p className="text-base">Welcome to the Letter of Recommendation Submission portal for higher studies! Here's a guide to help you navigate through the process:</p>

                    <ol className="pt-2 text-base pl-4 list-decimal">
                        <li>Sign up using your university email ID.</li>
                        <li>Log in with your university credentials.</li>
                        <li>Click on the "Apply Now" button to start your application.</li>
                        <li>Fill out the application form with the necessary details.</li>
                        <li>Select three staff members who you'd like to request letters of recommendation from.</li>
                        <li>Upload the required documents, such as your IELTS or GRE scores.</li>
                        <li>Review all the information you've provided.</li>
                        <li>Click the "Submit" button to finalize your application.</li>
                    </ol>

                    <p className="flex pt-4 justify-center">Thank you for choosing to pursue higher education. We wish you the best of luck!</p>

                    <br /><br />

                    <div className='flex justify-center'>
                        <button onClick={handleSubmission} className="bg-red-900 text-white px-6 py-2 rounded-md my-2 text-base">Begin Application</button>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}; 

export default Home;
