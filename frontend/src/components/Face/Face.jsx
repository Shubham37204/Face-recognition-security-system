import React from 'react'
import WebcamVideo from "./WebcamVideo/WebcamVideo";
import "./Face.css";

const Face = () => {
    return (
        <div>
            <div className="col-start-1 col-end-3 webcam "><WebcamVideo /></div>
        </div>
    )
}

export default Face
