import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

const CoaEditModal = ({ id, refetch, getCoaData, updateCoa, onClose }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [accountNumberEdit, setAccountNumberEdit] = useState("");
  const [accountNameEdit, setAccountNameEdit] = useState("");
  const [errorNumberEdit, setErrorNumberEdit] = useState("");
  const [errorNameEdit, setErrorNameEdit] = useState("");

  useQuery(["coa", id], getCoaData, {
    onSuccess(data) {
      if (data.data) {
        const { account_number, account_name } = data.data;
        setAccountNumberEdit(account_number);
        setAccountNameEdit(account_name);
      }
    },
  });

  const { mutate: editCoa } = useMutation((dataCoa) => updateCoa(dataCoa), {
    onSuccess: (data) => {
      let result = data;
      if (
        result["accountNameEdit"] == "Account name is required" ||
        result["accountNumberEdit"] == "Account number is required"
      ) {
        setErrorNumberEdit(result["accountNumberEdit"]);
        setErrorNameEdit(result["accountNameEdit"]);
      } else {
        const btnClose = document.querySelector(".btn-tutup-edit");
        btnClose.click();
        onClose();
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

  const handleUpdate = () => {
    let updated_by = user.user.name;
    const dataCoa = { id, accountNumberEdit, accountNameEdit, updated_by };
    editCoa(dataCoa);
  };

  return (
    <div
      className="modal fade"
      id="modal-edit"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Edit Data
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
                value={accountNumberEdit}
                onChange={(e) => setAccountNumberEdit(e.target.value)}
                type="text"
                className={`form-control ${
                  errorNumberEdit ? "is-invalid" : null
                }`}
                id="name"
                placeholder="Enter account number"
              />
              {errorNumberEdit && (
                <span className="text-danger"> {errorNumberEdit} </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Account Name
              </label>
              <input
                value={accountNameEdit}
                onChange={(e) => setAccountNameEdit(e.target.value)}
                type="text"
                className={`form-control ${
                  errorNameEdit ? "is-invalid" : null
                }`}
                id="name"
                placeholder="Enter account name"
              />
              {errorNameEdit && (
                <span className="text-danger"> {errorNameEdit} </span>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-tutup-edit"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleUpdate()}
              className="btn btn-primary"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoaEditModal;
