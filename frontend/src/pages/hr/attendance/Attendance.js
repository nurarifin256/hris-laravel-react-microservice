import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import MyMap from "../../../components/MyMap";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const Attendance = () => {
  const [snapshot, setSnapshot] = useState(null);
  const [camera, setCamera] = useState(false);
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSnapshot(imageSrc);
  };

  const handleSubmit = () => {
    // kirim data ke server
    console.log("Snapshot:", snapshot);
    // console.log("Location:", location);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={() => setCamera(true)}>
            <i className="fa-solid fa-camera"></i> Absent IN
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <MyMap />
        </div>
      </div>
      {camera && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <button onClick={handleCapture}>Capture photo</button>
          <button onClick={handleSubmit}>Submit</button>
          {snapshot && <img src={snapshot} alt="snapshot" />}
        </>
      )}
    </div>
  );
};

export default Attendance;
