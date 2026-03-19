import React, { useState } from 'react';
import "./Start.css"; // Import external CSS file
import MessageModal from '../Modals/MessageModal';

const Start = () => {
    const [modalMessage, setModalMessage] = useState(''); 
    const [showMessageModal, setShowMessageModal] = useState(false);

    const startModel = async () => {
        try {
            const response = await fetch('/start_model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (data.access === 'Granted') {
                console.log('Model started successfully');
                window.location.href = `/Welcome/${encodeURIComponent(JSON.stringify(data.message))}`;

            } else {
                setModalMessage(data.access === 'Denied' ? data.message : data.error);
                setShowMessageModal(true);
            }

        } catch (error) {
            console.log(error);
            setModalMessage('There seems to be an Issue.');
            setShowMessageModal(true);
        }
    };

    return (
        <div id="start-container">
            <h1 className="start-heading">
                Unlock the Power of AI Face Recognition<br/> with Cutting-Edge Technology
            </h1>
            <div className="button-container">
                <button onClick={startModel} className="start-button">
                    Start Recognition
                </button>
            </div>
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                message={modalMessage}
            />
        </div>
    );
};

export default Start;