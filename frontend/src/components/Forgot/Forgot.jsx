import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageModal from '../Modals/MessageModal';

const Forgot = () => {
    const [modalMessage, setModalMessage] = useState(''); 
    const [showMessageModal, setShowMessageModal] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const token = sessionStorage.getItem('access_token');

            const response = await fetch('/forgot', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: formData,
            });
            const data = await response.json();

            if (data.access === 'Granted') {
                setModalMessage(data.message);
                setShowMessageModal(true);
            } else {
                setModalMessage(data.message);
                setShowMessageModal(true);
            }

        } catch (error) {
            console.log(error);
            setModalMessage('Failed to reset password');
            setShowMessageModal(true);
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto mt-24">
                <div className="flex flex-col items-center justify-center  p-4 space-y-4 antialiased text-gray-900 ">
                    <div className="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16">
                        <h1 className=" mb-6 text-3xl font-bold text-center">
                            Don't worry
                        </h1>
                        <p className="text-center mx-12">We are here to help you to recover your password. Enter the email address you used
                            when you joined and we'll send you instructions to reset your password.</p>
                        <form onSubmit={handleForgotPassword} className="space-y-6 w-ful">
                            <input className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary-100" type="email" name="email" placeholder="Email address" required />
                            <div>
                                <button type="submit" className="w-full px-4 py-2 font-medium text-center text-white bg-green-600 transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
                                    Send
                                </button>
                            </div>
                        </form>
                        <div className="text-sm text-gray-600 items-center flex justify-between">
                            <Link to="/Login" className="text-blue-600 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back
                            </Link>
                            <Link to="/Contact" className="text-blue-600 hover:text-blue-500 cursor-pointer">Need help?</Link>
                        </div>
                    </div>
                </div>
            </div>
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                message={modalMessage}
            />
        </div>
    )
}

export default Forgot;
