import React from 'react';
import "./ModalPopup.css";

const MessageModal = ({ show, onClose, message }) => {
    const handleOkClick = () => {
        onClose();
    };

    return (
        <>
            {show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="modal-content">{message}</p>
                        <button className="modal-ok-button" onClick={handleOkClick}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageModal;
