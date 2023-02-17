import { useState } from "react";
import Select from "react-select";
import CurrencyFormat from "react-currency-format";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

const RefillEditModal = ({
  coas,
  department,
  refetch,
  getRefill,
  number,
  updateRefill,
}) => {
  let user = JSON.parse(localStorage.getItem("user"));

  const [idR, setIdR] = useState("");
  const [idCoaE, setIdCoaE] = useState("");
  const [idDepartmentE, setIdDepartmentE] = useState("");
  const [descriptionE, setDescriptionE] = useState("");
  const [debitE, setDebitE] = useState("");

  const [idRC, setIdRC] = useState("");
  const [idCoaCE, setIdCoaCE] = useState("");
  const [idDepartmentCE, setIdDepartmentCE] = useState("");
  const [descriptionCE, setDescriptionCE] = useState("");
  const [creditE, setCreditE] = useState("");

  const [errorDescriptionE, setErrorDescriptionE] = useState("");
  const [errorDebitE, setErrorDebitE] = useState("");

  const [errorDescriptionCE, setErrorDescriptionCE] = useState("");
  const [errorCreditE, setErrorCreditE] = useState("");

  useQuery(["refill", number], getRefill, {
    onSuccess(data) {
      if (data.data) {
        // data debit
        const { id, id_department, id_coa, description, debit } = data.data[0];
        setIdR(id);
        setIdCoaE(id_coa);
        setIdDepartmentE(id_department);
        setDescriptionE(description);
        setDebitE(debit);

        // data credit
        setIdRC(data.data[1].id);
        setIdDepartmentCE(data.data[1].id_department);
        setIdCoaCE(data.data[1].id_coa);
        setDescriptionCE(data.data[1].description);
        setCreditE(data.data[1].credit);
      }
    },
  });

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

  const { mutate: editRefill } = useMutation(
    (dataReffil) => updateRefill(dataReffil),
    {
      onSuccess(data) {
        let result = data;
        if (
          result["descriptionE"] == "Description is required" ||
          result["descriptionCE"] == "Description is required" ||
          result["debitE"] == "Debit is required" ||
          result["creditE"] == "Credit is required" ||
          result["debitE"] == "Debit must be balance credit" ||
          result["creditE"] == "Credit must be balance credit"
        ) {
          setErrorDescriptionE(result["descriptionE"]);
          setErrorDescriptionCE(result["descriptionCE"]);
          setErrorDebitE(result["debitE"]);
          setErrorCreditE(result["creditE"]);
        } else {
          const btnClose = document.querySelector(".btn-tutup-edit");
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
    }
  );

  const handleUpdate = () => {
    let updated_by = user.user.name;
    const dataReffil = {
      idR,
      idCoaE,
      idDepartmentE,
      descriptionE,
      debitE,
      idRC,
      idCoaCE,
      idDepartmentCE,
      descriptionCE,
      creditE,
      updated_by,
    };
    editRefill(dataReffil);
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
              <label className="form-label">Account number - name</label>
              <Select
                value={optionsCoa.filter(function (option) {
                  return option.value === idCoaE;
                })}
                onChange={(e) => setIdCoaE(e.value)}
                options={optionsCoa}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Position - Department</label>
              <Select
                value={optionsDepartment.filter(function (option) {
                  return option.value === idDepartmentE;
                })}
                onChange={(e) => setIdDepartmentE(e.value)}
                options={optionsDepartment}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${
                  errorDescriptionE ? "is-invalid" : null
                }`}
                value={descriptionE}
                onChange={(e) => setDescriptionE(e.target.value)}
              ></textarea>
              {errorDescriptionE && (
                <span className="text-danger"> {errorDescriptionE} </span>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Debit</label>
              <CurrencyFormat
                className={`form-control ${errorDebitE ? "is-invalid" : null}`}
                thousandSeparator={true}
                value={debitE}
                onChange={(e) => setDebitE(e.target.value)}
              />
              {errorDebitE && (
                <span className="text-danger"> {errorDebitE} </span>
              )}
            </div>

            <hr />

            <div className="mb-3 mt-3">
              <label className="form-label">Account number - name</label>
              <Select
                value={optionsCoa.filter(function (option) {
                  return option.value === idCoaCE;
                })}
                onChange={(e) => setIdCoaCE(e.value)}
                options={optionsCoa}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Position - Department</label>
              <Select
                value={optionsDepartment.filter(function (option) {
                  return option.value === idDepartmentCE;
                })}
                onChange={(e) => setIdDepartmentCE(e.value)}
                options={optionsDepartment}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className={`form-control ${
                  errorDescriptionCE ? "is-invalid" : null
                }`}
                value={descriptionCE}
                onChange={(e) => setDescriptionCE(e.target.value)}
              ></textarea>
              {errorDescriptionCE && (
                <span className="text-danger"> {errorDescriptionCE} </span>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Credit</label>
              <CurrencyFormat
                className={`form-control ${errorCreditE ? "is-invalid" : null}`}
                thousandSeparator={true}
                value={creditE}
                onChange={(e) => setCreditE(e.target.value)}
              />
              {errorCreditE && (
                <span className="text-danger"> {errorCreditE} </span>
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

export default RefillEditModal;
