import { useState } from "react";
import Select from "react-select";
import CurrencyFormat from "react-currency-format";
import { useMutation } from "react-query";

const RefillPostModal = ({ coas, department, postRefill }) => {
  let user = JSON.parse(localStorage.getItem("user"));

  const [idCoa, setIdCoa] = useState("");
  const [idDepartment, setIdDepartment] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [description, setDescription] = useState("");

  const [errorCoa, setErrorCoa] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorCredit, setErrorCredit] = useState("");
  const [errorDebit, setErrorDebit] = useState("");

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

  const { mutate: addRefill } = useMutation(
    (dataRefill) => postRefill(dataRefill),
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleSave = () => {
    let created_by = user.user.name;
    const dataRefill = {
      idCoa,
      idDepartment,
      description,
      debit,
      credit,
      created_by,
    };
    addRefill(dataRefill);
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
                onClick={() => handleSave()}
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

export default RefillPostModal;
