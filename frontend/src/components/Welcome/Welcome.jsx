import React from 'react';
import "./Welcome.css";
import { useParams } from 'react-router-dom';

const Welcome = () => {
    const { params } = useParams();

    let parsedData = null;
    if (params) {
        parsedData = JSON.parse(decodeURIComponent(params));
    }

    const particleCount = 100;

    const particles = Array.from({ length: particleCount }, (_, index) => index);

    const renderNames = () => {
        if (!parsedData) return null;
        return parsedData.map((item, index) => (
            <div className="name-box" key={index}>
                <div className="card" style={{ animationDelay: `${0.5 + index * 0.5}s` }}>
                    <div className="name" style={{ animationDelay: `${0.5 + index * 0.5}s` }}>{item.name}</div>
                </div>
            </div>
        ));
    }

    return (
        <div>
            <section id="hero" className="flex items-center">
                <div className="container relative" data-aos="fade-up" data-aos-delay="100">
                    <div className="grid justify-center">
                        <div className="col-span-7 lg:col-span-9 text-center">
                            <h1 id="welcomeText" className="text-5xl lg:text-6xl font-bold" style={{ marginTop: "-8rem" }}>
                                <span>W</span>
                                <span>e</span>
                                <span>l</span>
                                <span>c</span>
                                <span>o</span>
                                <span>m</span>
                                <span>e</span>
                            </h1>
                            <div className="names-box flex justify-between" style={{ marginTop: "4rem" }}>
                                {renderNames()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="particles-container">
                    {/* Mapping over the particles array to create dynamic particles */}
                    {particles.map((_, index) => (
                        <div className="particle" key={index} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}></div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Welcome;
