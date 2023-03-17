const GenerateGajiModal = ({ id, useQuery, generatePayroll }) => {
  const { data, isSuccess } = useQuery(["dataPayroll", id], generatePayroll);

  if (isSuccess) {
    console.log(data);
  }
  return (
    <div>
      <div
        className="modal fade"
        id="modal-generate"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Generate Payroll
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>tes</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-tutup"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                // onClick={() => handleSave()}
                className="btn btn-primary"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateGajiModal;
