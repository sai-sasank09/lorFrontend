import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import LoadingScreen from '../components/Loader';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const YesNoPage = ({ registerNumber, staffId }) => {
    const [response, setResponse] = useState('');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const server2 = 'http://127.0.0.1:5000';

    const handleResponse = async (answer) => {
        setIsLoading(true);
        setResponse(answer);

        try {
            const payload = { response: answer };
            if (answer === 'No') {
                if (!reason.trim()) {
                    toast.error('Please provide a reason for your response.');
                    setIsLoading(false);
                    return;
                }
                payload.reason = reason;
            }
            registerNumber = '41111109'
            staffId = '1'
            const res = await fetch(`${server2}/respond/${registerNumber}/${staffId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || `You selected "${answer}".`);
                setReason('');
            } else {
                toast.error(result.error || 'An error occurred.');
            }
        } catch (error) {
            toast.error('An error occurred while processing your response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow">
                    <Navbar />
                    <Toaster position="top-center" reverseOrder={false}></Toaster>
                    <div className="upload-bg md:px-0 px-10">
                        <div className="lg:w-1/4 md:w-2/4 s:w-2/4 xs:w-3/4 border p-4 bg-white md:bg-opacity-75 bg-opacity-80 backdrop-filter rounded-lg shadow-lg">
                            <div className="container mx-auto px-4 py-8">
                                <h1 className="text-3xl font-bold mb-4">Confirmation</h1>
                                <p className="text-lg mb-4">Do you agree with the statement?</p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleResponse('Yes')}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleResponse('No')}
                                    >
                                        No
                                    </button>
                                </div>
                                {response === 'No' && (
                                    <div className="mt-4">
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            placeholder="Please provide a reason for your response."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
                                            onClick={() => handleResponse('No')}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}
                                {response && response !== 'No' && (
                                    <div className="mt-4 bg-blue-200 text-blue-800 p-3 rounded">
                                        You selected: <strong>{response}</strong>
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

export default YesNoPage;
