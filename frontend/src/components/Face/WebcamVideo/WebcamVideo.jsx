import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import "../Face.css";
import Webcam from 'react-webcam';
import MessageModal from "../../Modals/MessageModal"
import "./WebcamVideo.css"

const WebcamVideo = () => {
  const webcamRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);

  const [modalMessage, setModalMessage] = useState(''); // Modal Popup Messages.
  const [showMessageModal, setShowMessageModal] = useState(false); // State to control modal visibility

  const location = useLocation();
  const [access, setAccess] = useState(false); // Allow to Move to next Page.
  const searchParams = new URLSearchParams(location.search);
  const user_name = searchParams.get('name')

  // Start webcam function
  const startWebcam = async () => {
    if (user_name) {
      setImageName(user_name);
      setIsWebcamOn(true);
    } else {
      setModalMessage("No UserName Found.");
      setShowMessageModal(true);
    }
  };

  // Stop webcam function
  const stopWebcam = () => {
    setIsWebcamOn(false);
    setImageCount(0);
    setCapturedImages([]);
  };

  //Capture image function
  const captureImage = async (event) => {
    event.preventDefault();

    const newImageCount = imageCount + 1;
    console.log(newImageCount);
    // console.log(newImageCount + " images");

    if (newImageCount > 4) { // Check if the user tries to capture more than 4 images
      setModalMessage('You have already captured the Maximum 4 images.');
      setShowMessageModal(true);
      return;
    }

    console.log(newImageCount + " images");

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages(prevImages => [...prevImages, imageSrc]);
    setImageCount(newImageCount);

    window.scrollTo(0, document.body.scrollHeight);
  };


  // Delete image function
  const deleteImage = (index) => {
    const updatedImages = [...capturedImages];
    updatedImages.splice(index, 1);
    setCapturedImages(updatedImages);
    setImageCount(imageCount - 1);
  };

  // Upload images function
  const uploadImages = async () => {
    try {
      const token = sessionStorage.getItem('access_token');

      console.log("Uploading images...");
      if (capturedImages.length !== 4) {
        console.log("Number of captured images:", capturedImages.length);
        setModalMessage("Please select Exactly 4 images.");
        setShowMessageModal(true);
        return;
      }

      const formData = new FormData();
      capturedImages.forEach((imageSrc, index) => {
        const byteCharacters = atob(imageSrc.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('images', blob, `${imageName}${index + 1}.jpg`);
      });

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
        },
        credentials: 'include',  // Include cookies in the request
        body: formData,
      });

      const data = await response.json();

      if (data.access === 'Granted') {
        setModalMessage(data.message);
        setShowMessageModal(true);
        setTimeout(2000);

        //Trying to Get 2 Messages (But wont Work -_-)
        setModalMessage(data.message2);
        setShowMessageModal(true);
        setTimeout(2000);
        setAccess(true);  //move to next page
        stopWebcam(); // Stop webcam after successful upload

      } else {
        setModalMessage(data.error);
        setShowMessageModal(true);
      }

    } catch (error) {
      setModalMessage("Upload Was Unsuccessful Due to Error: ", error);
      setShowMessageModal(true);
    }
  };

  // Function to handle modal OK button click
  const handleModalOkClick = () => {
    setShowMessageModal(false);

    if (access) {
      window.location.href = '/AdminPanel';
    }
  };

  return (
    <div style={{ marginTop: '3pc' }}>
      <div className="flex justify-center items-center flex-col">
        {isWebcamOn ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              mirrored={false}
              className='camera'
            />
            <div className="flex mt-5">
              <a href="#" onClick={captureImage} className="mr-5 rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">Capture Image</span>
              </a>
              <a href="#" onClick={stopWebcam} className="mr-5 rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">Stop Webcam</span>
              </a>
            </div>
          </>
        ) : (
          <a href="#" onClick={startWebcam} className="rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 mr-5 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300 mt-5">
            <span className="absolute right-0 w-8 h-32  -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">Start Webcam</span>
          </a>
        )}
        <div className="flex mt-5">
          {capturedImages.map((imageSrc, index) => (
            <div key={index} className="relative mr-4" style={{ maxWidth: '200px', height: 'auto' }}>
              <img
                src={imageSrc}
                alt={`Captured Image ${index + 1}`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <button onClick={() => deleteImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {capturedImages.length > 0 && (
          <a href="#" onClick={uploadImages} className="mt-5 rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">Upload</span>
          </a>
        )}

        <MessageModal
          show={showMessageModal}
          onClose={() => handleModalOkClick()}
          message={modalMessage}
        />

      </div>
    </div>
  );
};

export default WebcamVideo;
