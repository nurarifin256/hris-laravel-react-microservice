import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const CoaPostModal = ({ refetch, postCoa }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [account_number, setAccountNumber] = useState("");
  const [account_name, setAccountName] = useState("");
  const [errorNumber, setErrorNumber] = useState("");
  const [errorName, setErrorName] = useState("");

  const { mutate: addCoa } = useMutation((dataCoa) => postCoa(dataCoa), {
    onSuccess: (data) => {
      let result = data;
      if (
        result["account_name"] == "Account name is required" ||
        result["account_number"] == "Account number already exists" ||
        result["account_number"] == "Account number is required"
      ) {
        setErrorNumber(result["account_number"]);
        setErrorName(result["account_name"]);
      } else {
        const btnClose = document.querySelector(".btn-tutup");
        btnClose.click();
        refetch();
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
  });

  const handleSave = () => {
    let created_by = user.user.name;
    const dataCoa = { account_number, account_name, created_by };
    addCoa(dataCoa);
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
                <label htmlFor="name" className="form-label">
                  Account Number
                </label>
                <input
                  value={account_number}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  type="text"
                  className={`form-control ${
                    errorNumber ? "is-invalid" : null
                  }`}
                  id="name"
                  placeholder="Enter account number"
                />
                {errorNumber && (
                  <span className="text-danger"> {errorNumber} </span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Account Name
                </label>
                <input
                  value={account_name}
                  onChange={(e) => setAccountName(e.target.value)}
                  type="text"
                  className={`form-control ${errorName ? "is-invalid" : null}`}
                  id="name"
                  placeholder="Enter account name"
                />
                {errorName && (
                  <span className="text-danger"> {errorName} </span>
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

export default CoaPostModal;
