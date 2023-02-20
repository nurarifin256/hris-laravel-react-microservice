import { useState } from "react";
import Select from "react-select";
import CurrencyFormat from "react-currency-format";
import "../style.css";

const PettyCashPostModal = ({ coas, department, postRefill, refetch }) => {
  const [numberInvoice, setNumberInvoice] = useState("");
  const [errorInvoice, setErrorInvoice] = useState("");

  const [idCoa, setIdCoa] = useState("");
  const [idDepartment, setIdDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [debit, setDebit] = useState([
    {
      number: "",
      error: null,
    },
  ]);

  const [idCoaC, setIdCoaC] = useState("");
  const [idDepartmentC, setIdDepartmentC] = useState("");
  const [descriptionC, setDescriptionC] = useState("");
  const [credit, setCredit] = useState([
    {
      number: "",
      error: null,
    },
  ]);

  const [errorCoa, setErrorCoa] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorDebit, setErrorDebit] = useState("");

  const [errorCoaC, setErrorCoaC] = useState("");
  const [errorDepartmentC, setErrorDepartmentC] = useState("");
  const [errorDescriptionC, setErrorDescriptionC] = useState("");
  const [errorCredit, setErrorCredit] = useState("");

  const [images, setImages] = useState([]);

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

  const handleImageChange = (event) => {
    const selectedFIles = [];
    const targetFiles = event.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) => {
      return selectedFIles.push(URL.createObjectURL(file));
    });
    setImages(selectedFIles);
  };

  const addDebit = () => {
    const newDebit = [...debit, { number: "", error: null }];
    setDebit(newDebit);
  };

  const deleteDebit = () => {
    const newDebit = [...debit];
    newDebit.pop();
    setDebit(newDebit);
  };

  const handleDebitChange = (e, index) => {
    const newDebit = [...debit];
    newDebit[index].number = e.target.value;
    setDebit(newDebit);
  };

  const addCredit = () => {
    const newCredit = [...credit, { number: "", error: null }];
    setCredit(newCredit);
  };

  const deleteCredit = () => {
    const newCredit = [...credit];
    newCredit.pop();
    setCredit(newCredit);
  };

  const handleCreditChange = (e, index) => {
    const newCredit = [...credit];
    newCredit[index].number = e.target.value;
    setCredit(newCredit);
  };

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
                <label htmlFor="name" className="form-label">
                  Invoice Number
                </label>
                <input
                  value={numberInvoice}
                  onChange={(e) => setNumberInvoice(e.target.value)}
                  type="text"
                  className={`form-control ${
                    errorInvoice ? "is-invalid" : null
                  }`}
                  id="name"
                  placeholder="Enter invoice number"
                />
                {errorInvoice && (
                  <span className="text-danger"> {errorInvoice} </span>
                )}
              </div>

              <hr />

              {debit.map((debit, index) => (
                <div key={index}>
                  <div className="mb-3">
                    <label className="form-label">
                      Account number - name {index + 1}
                    </label>
                    <Select
                      placeholder="Choose COA"
                      className={errorCoa ? "is-invalid" : null}
                      onChange={(e) => setIdCoa(e.value)}
                      options={optionsCoa}
                    />
                    {errorCoa && (
                      <span className="text-danger"> {errorCoa} </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Position - Department {index + 1}
                    </label>
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
                    <label className="form-label">
                      Description {index + 1}
                    </label>
                    <textarea
                      className={`form-control ${
                        errorDescription ? "is-invalid" : null
                      }`}
                      placeholder="Enter description"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Debit {index + 1}</label>
                    <CurrencyFormat
                      className={`form-control ${
                        errorDebit ? "is-invalid" : null
                      }`}
                      thousandSeparator={true}
                      placeholder="Enter Debit"
                      onChange={(e) => handleDebitChange(e, index)}
                    />
                    {errorDebit && (
                      <span className="text-danger"> {errorDebit} </span>
                    )}
                  </div>
                </div>
              ))}

              <i
                className="bi bi-dash btn btn-danger btn-sm"
                onClick={() => deleteDebit()}
              ></i>
              <i
                className="bi bi-plus btn btn-primary btn-sm ms-2"
                onClick={() => addDebit()}
              ></i>

              <hr />

              {credit.map((credit, index) => (
                <div key={index}>
                  <div className="mb-3 mt-3">
                    <label className="form-label">
                      Account number - name {index + 1}
                    </label>
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
                    <label className="form-label">
                      Position - Department {index + 1}
                    </label>
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
                    <label className="form-label">
                      Description {index + 1}
                    </label>
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
                    <label className="form-label">Credit {index + 1}</label>
                    <CurrencyFormat
                      className={`form-control ${
                        errorCredit ? "is-invalid" : null
                      }`}
                      thousandSeparator={true}
                      placeholder="Enter Credit"
                      onChange={(e) => handleCreditChange(e, index)}
                    />
                    {errorCredit && (
                      <span className="text-danger"> {errorCredit} </span>
                    )}
                  </div>
                </div>
              ))}

              <i
                className="bi bi-dash btn btn-danger btn-sm"
                onClick={() => deleteCredit()}
              ></i>
              <i
                className="bi bi-plus btn btn-primary btn-sm ms-2"
                onClick={() => addCredit()}
              ></i>
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
