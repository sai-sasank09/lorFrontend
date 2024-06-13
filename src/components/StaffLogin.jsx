import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Footer from './footer';
import '../App.css';
import LoadingScreen from './Loader';
const StaffLogin = () => {
    const userType = 'staff';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState();
    const navigate = useNavigate();
    // useEffect(() => {
    //     // Simulate loading delay
    //     setTimeout(() => {
    //         setIsLoading(false);
    //     }, 2000);
    // }, []);


    // server's link 
    // const server1 = 'http://127.0.0.1:5000'
    const server2 = 'https://lorbackend.onrender.com'

    // const handleUserTypeChange = (e) => {
    //     setUserType(e.target.value);
    // };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${server2}/stafflogin`, {
                userType: userType,
                email: email,
                password: password
            });
            console.log(response.data);
            if (response.data.success) {
                localStorage.setItem('token_staff', response.data.token_staff);
                setIsLoading(false);
                navigate('/staff/studentCard');
            } else {
                setIsLoading(false);
                toast.error("Invalid Username or Password");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Invalid Username or Password")
        } finally {
            setIsLoading(false); // Set isLoading to false regardless of the response
        }
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className='flex flex-col min-h-screen'>
                <div className='flex-grow'>
                    <Navbar />

                    <div className="loginbg md:px-0 px-10">
                        <div className='lg:w-1/4 md:w-2/4 s:w-2/4 xs:w-3/4 border p-4 bg-white md:bg-opacity-60 bg-opacity-80 backdrop-filter  rounded-lg shadow-lg'>
                            <Toaster position="top-center" reverseOrder={false}></Toaster>
                            <div className=' flex justify-center'>
                                <h1 className='p-4 font-bold text-3xl'>STAFF LOGIN</h1>
                            </div>
                            <div className='justify-center'>
                                <form>
                                    <input
                                        className="border-2 border-solid border-black rounded-lg px-2 h-12 my-4 w-full"
                                        id="email"
                                        type="email"
                                        placeholder="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        className="border-2 border-solid border-black rounded-lg px-2 h-12 my-4 w-full"
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className=' flex justify-center'>
                                        <button className='bg-red-900 text-white px-6 py-2 rounded-md my-2 text-lg' type="button" onClick={handleSubmit}>Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default StaffLogin;
