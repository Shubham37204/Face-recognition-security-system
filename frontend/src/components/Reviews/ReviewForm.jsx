import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../Modals/MessageModal'; // Import the MessageModal component

function ReviewForm() {
    const [modalMessage, setModalMessage] = useState(''); // State to control modal visibility
    const [showMessageModal, setShowMessageModal] = useState(false); // State to control modal visibility
    const [access, setAccess] = useState(false);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        review: '',
        rating: '1'
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form data
        if (!formData.name || !formData.email || !formData.review || !formData.rating) {
            setModalMessage('Please fill in all required fields.');
            setShowMessageModal(true);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/submit_reviews', {
                method: 'POST',
                body: new FormData(event.target),
            });

            const data = await response.json();

            if (data.access === 'Granted') {
                setAccess(true);
                setModalMessage(data.message);
                setShowMessageModal(true);

            } else {
                setModalMessage(data.access === 'Denied' ? data.message : data.error);
                setShowMessageModal(true);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setModalMessage('Failed to submit review. Please try again.');
            setShowMessageModal(true);
        }
    };

    const handleModalOkClick = () => {
        setShowMessageModal(false);
        if (access) {
          window.location.href = '/';
        } 
      };


    return (
        <div className="ReviewForm-container mt-6">
            <h2 className="text-2xl font-bold mb-4" style={{
                display: 'flex', justifyContent: 'center', marginTop: "4pc"
            }}
            >Give Your Review</h2>
            <div className="form-container p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
                        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="review" className="block text-gray-700 font-bold mb-2">Review:</label>
                        <textarea id="review" name="review" value={formData.review} onChange={handleChange} rows="4" required className="w-full px-3 py-2 border rounded-md"></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">Star Rating:</label>
                        <select id="rating" name="rating" value={formData.rating} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-yellow-400">
                            <option value="1">&#9733;</option>
                            <option value="2">&#9733;&#9733;</option>
                            <option value="3">&#9733;&#9733;&#9733;</option>
                            <option value="4">&#9733;&#9733;&#9733;&#9733;</option>
                            <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600">Submit</button>
                </form>
            </div>
            <MessageModal
                show={showMessageModal}
                onClose={() => handleModalOkClick()}
                message={modalMessage}
            />
        </div>
    );
}

export default ReviewForm;