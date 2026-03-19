import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 mt-8 text-center text-white lg:text-left">
        <div className="bg-gray-700 p-4 text-center text-white">
          <div className="flex justify-center justify-space-evenly mt-5 mb-4">
            <Link to="/More" className="text-lg md:text-xl link">More</Link>
            <Link to="/Forgot" className="text-lg md:text-xl link">Forgot Password</Link>
            <Link to="/ReviewForm" className="text-lg md:text-xl link">Review form</Link>
          </div>
          © 2024 Copyright
        </div>
      </footer>
    </div>
  );
};

export default Footer;