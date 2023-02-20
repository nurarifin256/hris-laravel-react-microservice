import { useState } from "react";
import Select from "react-select";
import CurrencyFormat from "react-currency-format";
import "../style.css";

const PettyCashPostModal = ({ coas, department, postRefill, refetch }) => {
  const [idCoa, setIdCoa] = useState("");
  const [idDepartment, setIdDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState("");

  const [idCoaC, setIdCoaC] = useState("");
  const [idDepartmentC, setIdDepartmentC] = useState("");
  const [descriptionC, setDescriptionC] = useState("");
  const [credit, setCredit] = useState("");

  const [errorCoa, setErrorCoa] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorDebit, setErrorDebit] = useState("");

  const [errorCoaC, setErrorCoaC] = useState("");
  const [errorDepartmentC, setErrorDepartmentC] = useState("");
  const [errorDescriptionC, setErrorDescriptionC] = useState("");
  const [errorCredit, setErrorCredit] = useState("");

  //   const [previewUrl, setPreviewUrl] = useState(null);
  const [images, setImages] = useState([]);

  const handleImageChange = (event) => {
    const selectedFIles = [];
    const targetFiles = event.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) => {
      return selectedFIles.push(URL.createObjectURL(file));
    });
    setImages(selectedFIles);
  };

  const optionsCoa = coas.map((item) => {
    return {
      label: item.account_number + " - " + item.account_name,
      value: item.id,
    };
  });

  const optionsDepartment = department.map((item) => {
    return {
      label: item.name + " - " + item.positions.name,
      value: item.id,
    };
  });

  return (
    <div>
      <div
        className="modal fade"
        id="modal-add"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Data
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Attachment
                </label>
                <div>
                  {images.map((url, i) => {
                    return (
                      <div key={i} className="row-collumn">
                        <div className="collumn">
                          <img className="gambar" src={url} alt="Preview" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  className="form-control"
                  type="file"
                  multiple
                  id="formFile"
                  onChange={(e) => handleImageChange(e)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Account number - name</label>
                <Select
                  placeholder="Choose COA"
                  className={errorCoa ? "is-invalid" : null}
                  onChange={(e) => setIdCoa(e.value)}
                  options={optionsCoa}
                />
                {errorCoa && <span className="text-danger"> {errorCoa} </span>}
              </div>

              <div className="mb-3">
                <label className="form-label">Position - Department</label>
                <Select
                  placeholder="Choose Department"
                  className={errorDepartment ? "is-invalid" : null}
                  onChange={(e) => setIdDepartment(e.value)}
                  options={optionsDepartment}
                />
                {errorDepartment && (
                  <span className="text-danger"> {errorDepartment} </span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${
                    errorDescription ? "is-invalid" : null
                  }`}
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Debit</label>
                <CurrencyFormat
                  className={`form-control ${errorDebit ? "is-invalid" : null}`}
                  thousandSeparator={true}
                  placeholder="Enter Debit"
                  onChange={(e) => setDebit(e.target.value)}
                />
                {errorDebit && (
                  <span className="text-danger"> {errorDebit} </span>
                )}
              </div>

              <hr />

              <div className="mb-3 mt-3">
                <label className="form-label">Account number - name</label>
                <Select
                  placeholder="Choose COA"
                  className={errorCoaC ? "is-invalid" : null}
                  onChange={(e) => setIdCoaC(e.value)}
                  options={optionsCoa}
                />
                {errorCoaC && (
                  <span className="text-danger"> {errorCoaC} </span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Position - Department</label>
                <Select
                  placeholder="Choose Department"
                  className={errorDepartmentC ? "is-invalid" : null}
                  onChange={(e) => setIdDepartmentC(e.value)}
                  options={optionsDepartment}
                />
                {errorDepartmentC && (
                  <span className="text-danger"> {errorDepartmentC} </span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control ${
                    errorDescriptionC ? "is-invalid" : null
                  }`}
                  placeholder="Enter description"
                  onChange={(e) => setDescriptionC(e.target.value)}
                ></textarea>
                {errorDescriptionC && (
                  <span className="text-danger"> {errorDescriptionC} </span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Credit</label>
                <CurrencyFormat
                  className={`form-control ${
                    errorCredit ? "is-invalid" : null
                  }`}
                  thousandSeparator={true}
                  placeholder="Enter Credit"
                  onChange={(e) => setCredit(e.target.value)}
                />
                {errorCredit && (
                  <span className="text-danger"> {errorCredit} </span>
                )}
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
              <button
                type="button"
                // onClick={() => handleSave()}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PettyCashPostModal;
