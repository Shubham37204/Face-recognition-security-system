import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Search.css";
import MessageModal from '../../Modals/MessageModal';

const Search = () => {
    const [searchItem, setSearchItem] = useState('');
    const [filter, setFilter] = useState('username');
    const [searchResult, setSearchResult] = useState([]);

    const [modalMessage, setModalMessage] = useState(''); 
    const [showMessageModal, setShowMessageModal] = useState(false); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!searchItem.trim()) {
            setModalMessage('No UserName/UserId Entered.');
            setShowMessageModal(true);
            return;
        }

        if (filter === 'user_id') {
            const regex = /^user\d{4}$/;
            if (!regex.test(searchItem)) {
                setModalMessage('Please enter user id in the format "user####"');
                setShowMessageModal(true);
                return;
            }
        }

        if (filter === 'username') {
            const regex = /user\d{4}/;
            if (regex.test(searchItem)) {
                setModalMessage('Please enter a username, not a user ID.');
                setShowMessageModal(true);
                return;
            }
        }

        const formData = new FormData();
        formData.append('search_item', searchItem);
        formData.append('filter', filter);

        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.access === 'Granted') {
                setSearchResult(data.message);

            } else {
                setModalMessage(data.access === 'Denied' ? data.message : data.error);
                setShowMessageModal(true);
            }

        } catch (error) {
            console.error('Error:', error);
            setModalMessage('Failed to Fetch Accounts.');
            setShowMessageModal(true);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleInputChange = (event) => {
        setSearchItem(event.target.value);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <select
                    id="pricingType"
                    name="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    defaultValue="username"
                    className="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider">
                    <option value="username">User_Name</option>
                    <option value="user_id">User_Id</option>

                </select>
                <div className="flex">
                    <input
                        type="text"
                        name="search_item"
                        placeholder="Search for the tool you like"
                        value={searchItem}
                        onChange={handleInputChange}
                        className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none focus:border-sky-500"
                    />
                    <input
                        type="submit"
                        value="Search"
                        className="bg-sky-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1"
                        style={{height: '5.5vh'}}
                    />
                </div>
            </form>
            <div className="search-results">
                {Array.isArray(searchResult) && searchResult.map((user, index) => (
                    <Link to={`/folder/${user.user_id}/${user.user_name}`} key={index} className="search-result">
                        <div className="folder-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                <linearGradient id="Om5yvFr6YrdlC0q2Vet0Ha_WWogVNJDSfZ5_gr1" x1="-7.018" x2="39.387" y1="9.308" y2="33.533" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fac017"></stop><stop offset=".909" stop-color="#e1ab2d"></stop></linearGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0Ha_WWogVNJDSfZ5_gr1)" d="M44.5,41h-41C2.119,41,1,39.881,1,38.5v-31C1,6.119,2.119,5,3.5,5h11.597	c1.519,0,2.955,0.69,3.904,1.877L21.5,10h23c1.381,0,2.5,1.119,2.5,2.5v26C47,39.881,45.881,41,44.5,41z"></path><linearGradient id="Om5yvFr6YrdlC0q2Vet0Hb_WWogVNJDSfZ5_gr2" x1="5.851" x2="18.601" y1="9.254" y2="27.39" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbfef3"></stop><stop offset=".909" stop-color="#e2e4e3"></stop></linearGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0Hb_WWogVNJDSfZ5_gr2)" d="M2,25h20V11H4c-1.105,0-2,0.895-2,2V25z"></path><linearGradient id="Om5yvFr6YrdlC0q2Vet0Hc_WWogVNJDSfZ5_gr3" x1="2" x2="22" y1="19" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbfef3"></stop><stop offset=".909" stop-color="#e2e4e3"></stop></linearGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0Hc_WWogVNJDSfZ5_gr3)" d="M2,26h20V12H4c-1.105,0-2,0.895-2,2V26z"></path><linearGradient id="Om5yvFr6YrdlC0q2Vet0Hd_WWogVNJDSfZ5_gr4" x1="16.865" x2="44.965" y1="39.287" y2="39.792" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e3a917"></stop><stop offset=".464" stop-color="#d79c1e"></stop></linearGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0Hd_WWogVNJDSfZ5_gr4)" d="M1,37.875V38.5C1,39.881,2.119,41,3.5,41h41c1.381,0,2.5-1.119,2.5-2.5v-0.625H1z"></path><linearGradient id="Om5yvFr6YrdlC0q2Vet0He_WWogVNJDSfZ5_gr5" x1="-4.879" x2="35.968" y1="12.764" y2="30.778" gradientUnits="userSpaceOnUse"><stop offset=".34" stop-color="#ffefb2"></stop><stop offset=".485" stop-color="#ffedad"></stop><stop offset=".652" stop-color="#ffe99f"></stop><stop offset=".828" stop-color="#fee289"></stop><stop offset="1" stop-color="#fed86b"></stop></linearGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0He_WWogVNJDSfZ5_gr5)" d="M44.5,11h-23l-1.237,0.824C19.114,12.591,17.763,13,16.381,13H3.5C2.119,13,1,14.119,1,15.5	v22C1,38.881,2.119,40,3.5,40h41c1.381,0,2.5-1.119,2.5-2.5v-24C47,12.119,45.881,11,44.5,11z"></path><radialGradient id="Om5yvFr6YrdlC0q2Vet0Hf_WWogVNJDSfZ5_gr6" cx="37.836" cy="49.317" r="53.875" gradientUnits="userSpaceOnUse"><stop offset=".199" stop-color="#fec832"></stop><stop offset=".601" stop-color="#fcd667"></stop><stop offset=".68" stop-color="#fdda75"></stop><stop offset=".886" stop-color="#fee496"></stop><stop offset="1" stop-color="#ffe8a2"></stop></radialGradient><path fill="url(#Om5yvFr6YrdlC0q2Vet0Hf_WWogVNJDSfZ5_gr6)" d="M44.5,40h-41C2.119,40,1,38.881,1,37.5v-21C1,15.119,2.119,14,3.5,14h13.256	c1.382,0,2.733-0.409,3.883-1.176L21.875,12H44.5c1.381,0,2.5,1.119,2.5,2.5v23C47,38.881,45.881,40,44.5,40z"></path>
                            </svg>
                        </div>
                        <div className="user-details">
                            <span className='font-bold'>{user.user_name}</span><br />
                            <span className='font-semibold'>{user.user_id} </span>
                        </div>
                    </Link>
                ))}
            </div>
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                message={modalMessage}
            />
        </div>
    );
};

export default Search;
