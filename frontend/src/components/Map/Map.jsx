import React from 'react'
import "./Map.css"

const Map = () => {
    return (
        <div>
            <iframe
                // src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d915.6151136413827!2d85.33920707904794!3d23.371554139080335!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e1721c194ced%3A0xf02707411486a195!2sBIT%20Extension%20Lalpur!5e0!3m2!1sen!2sin!4v1707617443032!5m2!1sen!2sin"      //BIT EXT LALPUR
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3661.333832798601!2d85.439901!3d23.412305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb53f0c27be7%3A0x66180c1cf3c5e704!2sBirla%20Institute%20of%20Technology%20-%20Mesra!5e0!3m2!1sen!2sin!4v1715218988260!5m2!1sen!2sin&maptype=satellite"  //BIT MESRA
                width="600"
                height="450"
                style={{ border: "0" }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                className='map-container'>
                </iframe>
        </div>
    )
}

export default Map
