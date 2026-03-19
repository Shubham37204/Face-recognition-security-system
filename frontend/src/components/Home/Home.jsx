import React from 'react';
import HomeExplanation from './HomeExplanation';
import Feature from '../Feature/Feature';
import CounterAnimation from '../Counter/CounterAnimation';
import Testimonials from '../Testimonials/Testimonial';
import BackToTop from "../BackToTop/BackToTop";
import Start from "../Start/Start";

const Home = () => {
    return (
        <div>
            <HomeExplanation />
            <Start />
            <Feature />
            <CounterAnimation />
            <Testimonials />
            <BackToTop/>
        </div>
    )
}

export default Home
