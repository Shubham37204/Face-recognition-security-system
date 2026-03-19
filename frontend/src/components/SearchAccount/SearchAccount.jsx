import React, { useState } from 'react';
import "./Search.css";
import MessageModal from '../Modals/MessageModal';

const SearchAccount = () => {
    const [searchItem, setSearchItem] = useState('');
    const [filter, setFilter] = useState('username');
    const [searchResult, setSearchResult] = useState([]);
    const [showTable, setShowTable] = useState(false);

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

        const token = sessionStorage.getItem('access_token');

        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: formData,
            });

            const data = await response.json();

            if (data.access === 'Granted') {
                setSearchResult(data.message); 
                setShowTable(true);

            } else {
                setModalMessage(data.access === 'Denied' ? data.message : data.error);
                setShowMessageModal(true);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleInputChange = (event) => {
        setSearchItem(event.target.value);
    };

    return (
        <div className="search-container" style={{ marginTop: "5pc" }}>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <select
                    id="pricingType"
                    
                    name="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    defaultValue="username"
                    className="w-100 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider">
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
                        required
                        className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none focus:border-sky-500"
                    />
                    <input
                        type="submit"
                        value="Search"
                        className="bg-sky-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1"
                        required
                        style={{height: '5.5vh'}}
                    />
                </div>
            </form>

            <div className="table-container">
                {showTable && (
                    <table className="search-table">
                        <thead>
                            <tr className='top'>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>User Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(searchResult) && searchResult.map((user, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFD2' : '#eee' }}>
                                    <td>{index + 1}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <MessageModal
                show={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                message={modalMessage}
            />
        </div>
    );
};

export default SearchAccount;
