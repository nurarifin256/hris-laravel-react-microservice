import { useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useMutation, useQuery } from "react-query";
import Select from "react-select";
import { toast } from "react-toastify";

const PettyCashEditModal = ({
  number,
  numberJpd,
  coas,
  department,
  refetch,
  editPettyDetail,
  lastBallance,
  user,
  updatePettyDetail,
  firstBallance,
}) => {
  const [btnPostE, setBtnPostE] = useState(true);

  const [debitEdit, setDebitEdit] = useState([]);
  const [creditEdit, setCreditEdit] = useState([]);

  const [invEdit, setInvEdit] = useState("");

  const [errInvEdit, setErrInvEdit] = useState("");
  const [errDebitEdit, setErrDebitEdit] = useState("");
  const [errCreditEdit, setErrCreditEdit] = useState("");

  useQuery(["pettyCashEdit", number, numberJpd], editPettyDetail, {
    onSuccess(data) {
      if (data) {
        setDebitEdit(data.debit);
        setCreditEdit(data.credit);
      }
    },
  });

  const { mutate: editPetty } = useMutation(
    (dataUpdate) => updatePettyDetail(dataUpdate),
    {
      onSuccess(data) {
        console.log(data);
        let result = data;
        if (result["message"] == "Update petty cash sukses") {
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
        } else if (result["message"] == "Debit and Credit must be Ballance") {
          setErrDebitEdit(result["message"]);
          setErrCreditEdit(result["message"]);
        }
      },
    }
  );

  const handleUpdate = (e) => {
    e.preventDefault();
    let updated_by = user.user.name;
    const dataUpdate = {
      debitEdit,
      creditEdit,
      number,
      numberJpd,
      updated_by,
      firstBallance,
    };

    editPetty(dataUpdate);
  };

  const optionsCoaE = coas.map((item, index) => {
    return {
      label: item.account_number + " - " + item.account_name,
      value: item.id,
      name: "id_coa",
    };
  });

  const optionsDepartmentE = department.map((item) => {
    return {
      label: item.name + " - " + item.positions.name,
      value: item.id,
      name: "id_department",
    };
  });

  const handleSelectChangeE = (event, index, flag) => {
    const { name, value } = event;

    if (flag === "d") {
      const list = [...debitEdit];
      list[index][name] = value;
      setDebitEdit(list);
    } else {
      const list = [...creditEdit];
      list[index][name] = value;
      setCreditEdit(list);
    }
  };

  const handleInputChangeE = (event, index, flag) => {
    const { name, value } = event.target;
    if (flag === "d") {
      const list = [...debitEdit];
      list[index][name] = value;
      setDebitEdit(list);
    } else {
      const list = [...creditEdit];
      list[index][name] = value;
      setCreditEdit(list);
    }
  };

  const handleRemoveFieldsE = (flag) => {
    if (flag === "d") {
      const newInputFields = [...debitEdit];
      newInputFields.pop();
      setDebitEdit(newInputFields);
    } else {
      const newInputFields = [...creditEdit];
      newInputFields.pop();
      setCreditEdit(newInputFields);
    }
  };

  const handleAddFieldsE = (flag) => {
    if (flag === "d") {
      const values = [...debitEdit];
      values.push({
        id: 0,
        id_coa: null,
        id_department: null,
        description: "",
        debit: "",
      });
      setDebitEdit(values);
    } else {
      const values = [...creditEdit];
      values.push({
        id: 0,
        id_coa: null,
        id_department: null,
        description: "",
        debit: "",
      });
      setCreditEdit(values);
    }
  };

  const balanced = () => {
    if (lastBallance) {
      let totalDebit = 0.0;
      debitEdit.forEach((field) => {
        let Vdebit = field.debit.replace(/,/g, "");
        totalDebit += parseFloat(Vdebit);
      });

      if (totalDebit > lastBallance.balance) {
        setErrDebitEdit("Balance not enough");
        setErrCreditEdit("Balance not enough");
        setBtnPostE(false);
      } else {
        setErrDebitEdit(null);
        setErrCreditEdit(null);
        setBtnPostE(true);
      }
    }
  };

  return (
    <div>
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
              {debitEdit.length > 0 && (
                <>
                  <div className="mb-3">
                    <label htmlFor="invoice" className="form-label">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      name="invoice_number"
                      className={`form-control ${
                        errInvEdit ? "is-invalid" : null
                      }`}
                      id="invoice"
                      value={debitEdit[0].invoice_number}
                      onChange={(event) => handleInputChangeE(event, 0, "d")}
                    />
                    {errInvEdit && (
                      <span className="text-danger"> {errInvEdit} </span>
                    )}
                  </div>

                  {debitEdit.map((dDebit, index) => {
                    return (
                      <div key={index}>
                        <input type="hidden" value={dDebit.id} name="id" />

                        <div className="mb-3">
                          <label className="form-label">
                            Account number - name {index + 1}
                          </label>
                          <Select
                            name="id_coa"
                            options={optionsCoaE}
                            value={optionsCoaE.find(
                              (option) => option.value === dDebit.id_coa
                            )}
                            onChange={(event) =>
                              handleSelectChangeE(event, index, "d")
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Position - Department {index + 1}
                          </label>
                          <Select
                            placeholder="Choose Department"
                            name="id_department"
                            options={optionsDepartmentE}
                            value={optionsDepartmentE.find(
                              (option) => option.value === dDebit.id_department
                            )}
                            onChange={(event) =>
                              handleSelectChangeE(event, index, "d")
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Description {index + 1}
                          </label>
                          <textarea
                            className="form-control"
                            placeholder="Enter description"
                            name="description"
                            onChange={(event) =>
                              handleInputChangeE(event, index, "d")
                            }
                            value={dDebit.description}
                          ></textarea>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Debit {index + 1}
                          </label>
                          <CurrencyFormat
                            placeholder="Enter debit"
                            className={`form-control ${
                              errDebitEdit ? "is-invalid" : null
                            }`}
                            thousandSeparator={true}
                            name="debit"
                            onChange={(event) => {
                              handleInputChangeE(event, index, "d");
                              balanced();
                            }}
                            value={dDebit.debit}
                          />
                          {errDebitEdit && (
                            <span className="text-danger">{errDebitEdit}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {debitEdit.length > 1 ? (
                    <i
                      className="fa-solid fa-minus btn btn-danger btn-sm"
                      onClick={() => handleRemoveFieldsE("d")}
                    ></i>
                  ) : (
                    ""
                  )}

                  <i
                    className="fa-solid fa-plus btn btn-primary btn-sm ms-2"
                    onClick={() => handleAddFieldsE("d")}
                  ></i>

                  <hr />

                  {creditEdit.map((dCredit, index) => {
                    return (
                      <div key={index}>
                        <input type="hidden" value={dCredit.id} name="id" />

                        <div className="mb-3">
                          <label className="form-label">
                            Account number - name {index + 1}
                          </label>
                          <Select
                            name="id_coa"
                            options={optionsCoaE}
                            value={optionsCoaE.find(
                              (option) => option.value === dCredit.id_coa
                            )}
                            onChange={(event) =>
                              handleSelectChangeE(event, index, "c")
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Position - Department {index + 1}
                          </label>
                          <Select
                            name="id_department"
                            options={optionsDepartmentE}
                            value={optionsDepartmentE.find(
                              (option) => option.value === dCredit.id_department
                            )}
                            onChange={(event) =>
                              handleSelectChangeE(event, index, "c")
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Description {index + 1}
                          </label>
                          <textarea
                            className="form-control"
                            placeholder="Enter description"
                            name="description"
                            onChange={(event) =>
                              handleInputChangeE(event, index, "c")
                            }
                            value={dCredit.description}
                          ></textarea>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Credit {index + 1}
                          </label>
                          <CurrencyFormat
                            placeholder="Enter credit"
                            className={`form-control ${
                              errCreditEdit ? "is-invalid" : null
                            }`}
                            thousandSeparator={true}
                            name="credit"
                            onChange={(event) => {
                              handleInputChangeE(event, index, "c");
                              balanced();
                            }}
                            value={dCredit.credit}
                          />
                          {errCreditEdit && (
                            <span className="text-danger">
                              {" "}
                              {errCreditEdit}{" "}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {creditEdit.length > 1 ? (
                    <i
                      className="fa-solid fa-minus btn btn-danger btn-sm"
                      onClick={() => handleRemoveFieldsE("c")}
                    ></i>
                  ) : (
                    ""
                  )}

                  <i
                    className="fa-solid fa-plus btn btn-primary btn-sm ms-2"
                    onClick={() => handleAddFieldsE("c")}
                  ></i>

                  <hr />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-tutup-edit"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {btnPostE && (
                <button
                  type="button"
                  onClick={(e) => handleUpdate(e)}
                  className="btn btn-primary"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PettyCashEditModal;

// 0 : debit : "200000.00", description : "bayar lembur", id : 106, id_coa : 12, id_department : 2
// 1 : debit : "25000.00", description : "bayar makan", id : 107, id_coa : 11, id_department : 2
