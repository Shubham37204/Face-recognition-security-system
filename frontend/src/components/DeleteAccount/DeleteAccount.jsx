import React, { useState } from 'react';
import DeleteModalMessage from '../Modals/DeleteModalMessage';
import MessageModal from '../Modals/MessageModal';

const DeleteAccount = () => {
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [showMessageModal, setShowMessageModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Show the delete confirmation modal
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);

      const response = await fetch('/delete_account', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // Display message modal with the response message
      setModalMessage(data.message);
      setShowMessageModal(true);

    } catch (error) {
      console.error('Error:', error);
      setModalMessage('An error occurred while processing your request.');
      setShowMessageModal(true);
    } finally {
      // Close the modal
      setShowModal(false);
      setUserId(''); // Clear userId after deletion
    }
  };

  const handleCancel = () => {
    // Close the modal without deleting the account
    setShowModal(false);
    // Clear userId
    setUserId('');
  };

  return (
    <div className="max-w-4xl mx-auto mt-24">
      <div className="flex flex-col items-center justify-center p-4 space-y-4 antialiased text-gray-900 ">
        <div className="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16">
          <h1 className="mb-6 text-3xl font-bold text-center">Delete User</h1>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary-100"
              type="text"
              name="userId"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Your User ID"
              required
            />
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-center text-white bg-green-600 transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteModalMessage
        show={showModal}
        onClose={handleCancel}
        message={`Are you sure you want to delete the account with user ID ${userId}?`}
        onYes={handleDeleteConfirmation}
        onNo={handleCancel}
      />
      <MessageModal
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default DeleteAccount;
