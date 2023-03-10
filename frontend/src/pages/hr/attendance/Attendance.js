import { useState, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import { postAttendance } from "../../../config/hooks/hr/attendancesHook";
import Webcam from "react-webcam";
import MyMap from "../../../components/MyMap";

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

const Attendance = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const webcamRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const [camera, setCamera] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // ambil posisi
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  });

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSnapshot(imageSrc);
  };

  const { mutate: addAttendace } = useMutation(
    (formData) => postAttendance(formData),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let created_by = user.user.name;
    let id_employee = user.user.id;

    const formData = new FormData();

    formData.append("created_by", created_by);
    formData.append("id_employee", id_employee);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("image", dataURItoBlob(snapshot), "image.jpg");

    addAttendace(formData);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="text-center">
            <h3>Your Location</h3>
            <MyMap latitude={latitude} longitude={longitude} />
          </div>
        </div>

        {snapshot ? (
          <div className="col-md-6">
            <div className="text-center my-2">
              <div>
                <h3>Your Photo</h3>
                <img src={snapshot} alt="snapshot" />
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={(e) => handleSubmit(e)}
                >
                  <i class="fa-solid fa-check"></i> Absent
                </button>
                <button
                  className="btn btn-success mt-2 ms-2"
                  onClick={() => setSnapshot(false)}
                >
                  <i className="fa-solid fa-camera"></i> Retake Photo
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-4">
            <div className="text-center">
              <button
                className="btn btn-primary my-2"
                onClick={() => setCamera(true)}
              >
                <i className="fa-solid fa-camera"></i> Absent IN
              </button>
              {camera && (
                <>
                  <div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleCapture()}
                    >
                      Capture photo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
