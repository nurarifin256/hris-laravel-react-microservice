const LocationModal = ({ latitudeM, longitudeM, MyMap, image }) => {
  return (
    <div>
      <div
        className="modal fade"
        id="modal-location"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Location
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <MyMap latitude={latitudeM} longitude={longitudeM} />
                <img
                  src={"http://127.0.0.1:8000/api/" + image}
                  className="img-thumbnail mt-3"
                  alt="img-attendance"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-tutup"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
