import React, { useState, useEffect } from "react";
import styles from "./timeline.module.css"; // Import CSS module

const Timeline = () => {
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/fetch_timeline');
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

    // Function to generate colors in a cyclic manner
    const generateColor = (index) => {
        const colors = ["#41516C", "#FBCA3E", "#E24A68", "#1B5F8C", "#4CADAD"];
        return colors[index % colors.length];
    };

    return (
        <div style={{marginTop : "5pc"}}>
            <h1 className="text-center text-3xl font-bold mb-8">General Timeline</h1>
            <ul className={styles.ul} style={{ "--timeline-length": timelineData.length }}> {/* Use styles.ul for className */}
                {timelineData.map((item, index) => (
                    <li key={index} style={{ "--accent-color": generateColor(index) }}>
                        <div className={styles.date}>{item.date}</div> {/* Use styles.date for className */}
                        <div className={styles.title}>{item.name}</div> {/* Use styles.title for className */}
                        <div className={styles.title}>{item.time}</div> {/* Use styles.title for className */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Timeline;