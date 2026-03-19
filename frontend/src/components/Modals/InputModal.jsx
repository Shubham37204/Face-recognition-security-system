import React, { useState } from 'react';
import "./InputModal.css";

const InputModal = ({ show, onClose, onInputSubmit, inputPrompt }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleOkClick = () => {
        onInputSubmit(inputValue);
        setInputValue('');
        onClose();
    };

    return (
        <>
            {show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p id="modal-prompt">{inputPrompt}</p>
                        <input
                            type="text"
                            id='InputBox'
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Enter your input"
                        />
                        <button id="modal-ok-button" className='SubmitOk' onClick={handleOkClick}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InputModal;