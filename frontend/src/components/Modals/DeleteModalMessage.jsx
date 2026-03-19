import React from 'react';
import "./DeleteModalMessage.css"

const DeleteModalMessage = ({ show, onClose, message, onYes, onNo }) => {
    const handleYesClick = () => {
        onYes();
    };

    const handleNoClick = () => {
        onNo();
    };

    return (
        <>
            {show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="modal-content">{message}</p>
                        <div className="modal-buttons">
                            <button className="modal-button" id="modal-yes-button" onClick={handleYesClick}>
                                Yes
                            </button>
                            <button className="modal-button" id="modal-no-button" onClick={handleNoClick}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteModalMessage;