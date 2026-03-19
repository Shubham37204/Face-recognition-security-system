import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import MessageModal from '../Modals/MessageModal';
import InputModal from '../Modals/InputModal';

const EditAccount = () => {
  const [folderImages, setFolderImages] = useState([]);
  const [realName, setRealName] = useState([]);
  const [imgCount, setImgCount] = useState(0);

  const [modalInputPrompt, setModalInputPrompt] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);

  const [modalMessage, setModalMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { user_id, user_name: initialUserName } = useParams();
  const [user_name, setUser_name] = useState(initialUserName);  //object destructuring to rename the user_name variable from useParams() to initialUserName.

  // Function to handle opening the rename modal
  const openInputModal = () => {
    setModalInputPrompt('Enter the new name for the image:');
    setShowInputModal(true);
  };

  // Function to handle the input submission for renaming images
  const handleInputSubmit = async (newName) => {
    setShowInputModal(false);
    await handleRenameImage(newName); // Pass the new name to handleRenameImage function
  };


  const handleRenameImage = async (newName) => {
    if (!user_id) {
      setModalMessage('User ID is undefined');
      setShowMessageModal(true);
      return;
    }

    if (!newName) {
      setModalMessage('User canceled the operation or entered an empty name.');
      setShowMessageModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('new_name', newName);
    formData.append('old_name', realName);


    try {
      const response = await fetch('http://localhost:5000/rename', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success === true) {
        setModalMessage(data.message);
        setShowMessageModal(true);
        setUser_name(newName);  //Add the new name value.
        sessionStorage.setItem('user_name', newName);
        setRefresh(true);


      } else if (data.success === false) {
        setModalMessage(data.message);
        setShowMessageModal(true);

      } else {
        setModalMessage(data.error);
        setShowMessageModal(true);
      }
    } catch (error) {
      console.error('Error renaming images:', error);
    }
  };

  // In the useEffect hook, retrieve the stored name from session storage
  useEffect(() => {
    const storedUserName = sessionStorage.getItem('user_name');
    if (storedUserName) {
      setUser_name(storedUserName);
    }
  }, []);


  //Handeles the Deletion of the Images.
  const handleDeleteImage = async (imageName) => {
    if (!user_id) {
      console.error('User ID is undefined');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('image_name', imageName);

    try {
      const response = await fetch('http://localhost:5000/delete_image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (data.success === true) {
        setModalMessage(data.message);
        setShowMessageModal(true);
        setRefresh(true);

      } else if (data.success === false) {
        setModalMessage(data.message);
        setShowMessageModal(true);

      } else {
        setModalMessage(data.error);
        setShowMessageModal(true);
      }
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!user_id) {
        console.error('Folder name is undefined');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/match_face/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          const RealName = data.images.length > 0 ? data.images[0].replace(/\d\.jpg$/, '') : '';

          setImgCount(data.images.length);
          setFolderImages(data.images);
          setRealName(RealName);

        } else {
          throw new Error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    if (user_id) {
      fetchImages();
    }
  }, [user_id]);


  const handleModalOkClick = () => {
    setShowMessageModal(false);

    if (refresh) {
      window.location.reload()
    }
  };


  return (
    <div>
      {/* <div className="grid grid-cols-12 gap-4" style={{ marginTop: '10pc', alignItems: 'center', display: 'flex', justifyContent: 'space-evenly' }}> */}
      <div className="grid grid-cols-12 gap-4" style={{ marginTop: '10pc', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        {folderImages.length < 4 && (
          <Link to={`/EditFace/${user_id}/${user_name}/${imgCount}`} className="...">
            <button type="submit" className="relative px-10 py-3 font-medium text-white transition duration-300 bg-green-400 rounded-md hover:bg-green-500 ease" style={{ marginRight: '20px' }}>
              <span className="relative">Capture</span>
            </button>
          </Link>
        )}
        <button onClick={openInputModal} className="relative px-10 py-3 font-medium text-white transition duration-300 bg-blue-400 rounded-md hover:bg-blue-500 ease">
          <span className="relative">Rename</span>
        </button>
      </div>

      <section id="Projects" style={{ marginTop: '5.5pc' }} className="upper w-fit mx-auto grid grid-cols-4 gap-y-8 gap-x-4 justify-items-center justify-center mb-5">
        {folderImages.map((image, index) => {
          const imageNameWithoutExtension = image.split('.')[0];
          return (
            <div key={index} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
              <a href="#">
                <img src={`http://localhost:5000/match_face/${user_id}/${image}`} alt={`Image ${index + 1}`} className="h-80 w-72 object-cover rounded-t-xl" />
                <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-1 ...">
                  <div class="col-span-2">
                    <div className="px-4 py-3 w-72">
                      <p className="text-lg font-bold text-black truncate block capitalize">{imageNameWithoutExtension}</p>
                    </div>
                  </div>
                  <div>
                    <div style={{ "margin-top": "0.9pc", "margin-left": "4pc" }}>
                      <svg
                        onClick={() => handleDeleteImage(image)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </section >
      <MessageModal
        show={showMessageModal}
        onClose={() => handleModalOkClick()}
        message={modalMessage}
      />

      <InputModal
        show={showInputModal}
        onClose={() => setShowInputModal(false)}
        onInputSubmit={handleInputSubmit}
        inputPrompt={modalInputPrompt}
      />
    </div >
  );
};

export default EditAccount;
