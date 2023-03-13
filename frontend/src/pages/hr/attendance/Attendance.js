import { useState, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import {
  postAttendance,
  getAttendace,
} from "../../../config/hooks/hr/attendancesHook";
import { toast, ToastContainer } from "react-toastify";
import Webcam from "react-webcam";
import MyMap from "../../../components/MyMap";
import HistoryAttendanceDT from "./dataTables/HistoryAttendanceDT";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";

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
  const [type, setType] = useState(null);

  const [errorType, setErrorType] = useState(null);

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
    if (type === null) {
      setErrorType("Absent type must be selected");
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      setSnapshot(imageSrc);
    }
  };

  const { mutate: addAttendace } = useMutation(
    (formData) => postAttendance(formData),
    {
      onSuccess: (data) => {
        let result = data;
        console.log(result);
        if (result["message"] == "your location is outside the office area") {
          toast.error(result["message"], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          setSnapshot(false);
          toast.success(result["message"], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let created_by = user.user.name;
    let id_employee = user.user.id_employee;

    const formData = new FormData();

    formData.append("created_by", created_by);
    formData.append("id_employee", id_employee);
    formData.append("type", type);
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
                  <i className="fa-solid fa-check"></i> Submit
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
              {camera ? (
                <>
                  <select
                    required
                    className={`form-select my-2 ${
                      errorType ? "is-invalid" : null
                    }`}
                    aria-label="Default select example"
                    id="select-type"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Choose Absent Type</option>
                    <option value="1">in</option>
                    <option value="2">out</option>
                    <option value="3">in over time</option>
                    <option value="4">out over time</option>
                  </select>
                  {errorType && (
                    <span className="text-danger mb-2"> {errorType} </span>
                  )}

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
              ) : (
                <button
                  className="btn btn-primary my-2"
                  onClick={() => setCamera(true)}
                >
                  <i className="fa-solid fa-camera"></i> Absent
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <HistoryAttendanceDT
        idEmployee={user.user.id_employee}
        getAttendace={getAttendace}
        MyMap={MyMap}
      />

      <ToastContainer />
    </div>
  );
};

export default Attendance;
