import React, { useState, useEffect } from "react";

const LoginTimestamp = () => {
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/fetch_login_timestamp');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (data.access === 'Granted') {
                setTimelineData(data.message);
            } else {
                console.error('Access not granted');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div style={{ marginTop: "4pc" }}>
            <div className="max-w-screen-lg mx-auto py-8">
                <h1 className="text-center text-3xl font-bold mb-8">System Login Timeline</h1>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {timelineData.map((item, index) => (
                        <li key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                            <div className="p-4">
                                <div className={`p-4 ${index % 5 === 0 ? 'bg-blue-700 text-white' : index % 5 === 1 ? 'bg-yellow-400 text-gray-800' : index % 5 === 2 ? 'bg-pink-500 text-white' : index % 5 === 3 ? 'bg-blue-900 text-white' : 'bg-teal-500 text-white'} font-semibold text-lg`}>
                                    {item.date}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-gray-800 font-semibold mb-2">{item.name}</h2>
                                    <p className="text-gray-600">Time: {item.time}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LoginTimestamp;