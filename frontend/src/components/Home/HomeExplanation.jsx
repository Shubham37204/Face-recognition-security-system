import React from "react";
import Typewriter from "typewriter-effect";
import { NavLink } from "react-router-dom";
import "./HomeExplanation.css";

const HomeExplanation = () => {
    return (
        <div style={{marginTop : "6pc"}}>
            {/* <Particle /> */}
            <div className='grid'>
                <h1 className="mb-4  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white homes" >
                    <Typewriter
                        options={{
                            strings: ['The', 'Era', 'Of', 'AI'],
                            autoStart: true,
                            loop: true,
                        }}
                        typeSpeed={40}
                        backSpeed={60}
                        loop
                    /></h1>
                <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 homes">
                    Artificial intelligence algorithms are used in AI face detection, a novel technique that locates and identifies human faces inside picture or video frames. This advanced system can reliably detect and recognise faces in a variety of scenarios by analysing facial traits and patterns using deep learning models, such as convolutional neural networks. AI face detection has a wide range of uses, from improving security in surveillance systems by using facial recognition to simplifying smartphone unlocking for users.
                </p>
                <div>
                    <NavLink to="/More" className='More-btn rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300'>
                        <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                        <span class="relative">To Know More About AI</span>
                    </NavLink>
                </div>
            </div>

        </div>
    );
};

export default HomeExplanation;
