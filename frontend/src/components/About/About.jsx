import React from 'react';
import Sachin from "../../About-Image/Sachin.jpg";
import Shubham from "../../About-Image/Shubham.jpg";
import Shekhar from "../../About-Image/Shekhar.jpg";
import Sanjeev from "../../About-Image/Sanjeev.jpg";
import Subscribe from "../Subscribe/Subscribe";

const About = () => {
  return (
    <div>
      <div className="about mb-8">
        <section className='team_members'>
          <div className="container_about flex justify-center mx-auto pt-16">
            <div>
              <h1 className="xl:text-4xl text-3xl text-center text-gray-800 font-extrabold pb-6 sm:w-4/6 w-5/6 mx-auto">The Talented People Behind the Scenes of the Organization</h1>
            </div>
          </div>
          <div className="w-full  px-10 pt-10">
            <div className="container_about mx-auto">
              <div role="list" aria-label="Behind the scenes People " className="lg:flex md:flex sm:flex items-center xl:justify-between flex-wrap md:justify-around sm:justify-around lg:justify-around">
                <div className="grid grid-cols-2 gap-8">
                  <div role="listitem" className="relative mt-16 mb-32 sm:mb-24">
                    <div className="rounded overflow-hidden shadow-md bg-white">
                      <div className="absolute -mt-20 w-full flex justify-center">
                        <div className="h-32 w-32">
                          <img src={Sachin} alt="Display Picture of Andres Berlin" role="img" className="rounded-full object-cover h-full w-full shadow-md" />
                        </div>
                      </div>
                      <div className="px-6 mt-16">
                        <h1 className="font-bold text-3xl text-center mb-1">Satyam Kumar</h1>
                        <p className="text-gray-800 text-sm text-center">Lead Backend</p>
                        <p className="text-center text-gray-600 text-base pt-3 font-normal">As the Lead Backend, I designed the Flask-based backend server and managed the MySQL database. I was responsible for integrating the Face Detection model and ensuring accurate backend responses.</p>
                        <div className="w-full flex justify-center pt-5 pb-5">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="listitem" className="relative mt-16 mb-32 sm:mb-24">
                    <div className="rounded overflow-hidden shadow-md bg-white">
                      <div className="absolute -mt-20 w-full flex justify-center">
                        <div className="h-32 w-32">
                          <img src={Shubham} alt="Display Picture of Silene Tokyo" role="img" className="rounded-full object-cover h-full w-full shadow-md" />
                        </div>
                      </div>
                      <div className="px-6 mt-16">
                        <h1 className="font-bold text-3xl text-center mb-1">Shubham Bhardwaj</h1>
                        <p className="text-gray-800 text-sm text-center">Lead Frontend</p>
                        <p className="text-center text-gray-600 text-base pt-3 font-normal">As the Lead Frontend Developer, I design and implement a user interface with  modern frontend technologies like HTML, CSS, JavaScript, and popular frameworks like React.</p>
                        <div className="w-full flex justify-center pt-5 pb-5">
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="w-full  px-10 pt-10">
            <div className="container_about mx-auto">
              <div role="list" aria-label="Behind the scenes People " className="lg:flex md:flex sm:flex items-center xl:justify-between flex-wrap md:justify-around sm:justify-around lg:justify-around">
                <div className="grid grid-cols-2 gap-8">
                  <div role="listitem" className="relative mt-16 mb-32 sm:mb-24">
                    <div className="rounded overflow-hidden shadow-md bg-white">
                      <div className="absolute -mt-20 w-full flex justify-center">
                        <div className="h-32 w-32">
                          <img src={Sanjeev} alt="Display Picture of Andres Berlin" role="img" className="rounded-full object-cover h-full w-full shadow-md" />
                        </div>
                      </div>
                      <div className="px-6 mt-16">
                        <h1 className="font-bold text-3xl text-center mb-1">Sanjeev Kumar</h1>
                        <p className="text-gray-800 text-sm text-center">Lead Designer</p>
                        <p className="text-center text-gray-600 text-base pt-3 font-normal">Designed diffrent parts of webpages using react and tailwin.</p>
                        <div className="w-full flex justify-center pt-5 pb-5">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="listitem" className="relative mt-16 mb-32 sm:mb-24">
                    <div className="rounded overflow-hidden shadow-md bg-white">
                      <div className="absolute -mt-20 w-full flex justify-center">
                        <div className="h-32 w-32">
                          <img src={Shekhar} alt="Display Picture of Silene Tokyo" role="img" className="rounded-full object-cover h-full w-full shadow-md" />
                        </div>
                      </div>
                      <div className="px-6 mt-16">
                        <h1 className="font-bold text-3xl text-center mb-1">Sheker kumar singh</h1>
                        <p className="text-gray-800 text-sm text-center">Lead Designer</p>
                        <p className="text-center text-gray-600 text-base pt-3 font-normal">I served as the UI designer for our Facial Recognition Security System project, ensuring a seamless and intuitive user experience.</p>
                        <div className="w-full flex justify-center pt-5 pb-5">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Subscribe />
    </div>
  )
}

export default About;
