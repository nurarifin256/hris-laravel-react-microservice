import { useState } from "react";
import Select from "react-select";
import CurrencyFormat from "react-currency-format";
import "../style.css";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const PettyCashPostModal = ({
  coas,
  department,
  postPettyDetail,
  refetch,
  number,
  lastBallance,
}) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [numberInvoice, setNumberInvoice] = useState("");
  const [errorInvoice, setErrorInvoice] = useState("");
  const [images, setImages] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);

  const [errorCoa, setErrorCoa] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorDebit, setErrorDebit] = useState("");

  const [errorCoaC, setErrorCoaC] = useState("");
  const [errorDepartmentC, setErrorDepartmentC] = useState("");
  const [errorDescriptionC, setErrorDescriptionC] = useState("");
  const [errorCredit, setErrorCredit] = useState("");

  const [errorImage, setErrorImage] = useState("");

  const optionsCoa = coas.map((item) => {
    return {
      label: item.account_number + " - " + item.account_name,
      value: item.id,
      name: "idCoa",
    };
  });

  const optionsCoaC = coas.map((item) => {
    return {
      label: item.account_number + " - " + item.account_name,
      value: item.id,
      name: "idCoaC",
    };
  });

  const optionsDepartment = department.map((item) => {
    return {
      label: item.name + " - " + item.positions.name,
      value: item.id,
      name: "idDepartment",
    };
  });

  const optionsDepartmentC = department.map((item) => {
    return {
      label: item.name + " - " + item.positions.name,
      value: item.id,
      name: "idDepartmentC",
    };
  });

  const [inputFields, setInputFields] = useState([
    {
      idCoa: null,
      idDepartment: null,
      description: "",
      debit: "",
    },
  ]);

  const [inputFieldsC, setInputFieldsC] = useState([
    {
      idCoaC: null,
      idDepartmentC: null,
      descriptionC: "",
      credit: "",
    },
  ]);

  const handleImageChange = (event) => {
    const selectedFIles = [];
    const targetFiles = event.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) => {
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        setErrorImage("Image type must be jpg/jpeg/png/gif");
        return false;
      } else {
        setErrorImage(null);
        return selectedFIles.push(URL.createObjectURL(file));
      }
    });
    setImages(selectedFIles);
    setImagesUpload(targetFiles);
  };

  // const [errors, setErrors] = useState([
  //   { idCoa: null, idDepartment: null, description: null, debit: null },
  // ]);

  const reset = () => {
    setImages([]);
    setInputFields([
      {
        idCoa: null,
        idDepartment: null,
        description: "",
        debit: "",
      },
    ]);

    setInputFieldsC([
      {
        idCoaC: null,
        idDepartmentC: null,
        descriptionC: "",
        credit: "",
      },
    ]);
  };

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({
      idCoa: null,
      idDepartment: null,
      description: "",
      debit: "",
    });
    setInputFields(values);
  };

  const handleAddFieldsC = () => {
    const values = [...inputFieldsC];
    values.push({
      idCoaC: null,
      idDepartmentC: null,
      descriptionC: "",
      credit: "",
    });
    setInputFieldsC(values);
  };

  const handleRemoveFields = () => {
    const newInputFields = [...inputFields];
    newInputFields.pop();
    setInputFields(newInputFields);
  };

  const handleRemoveFieldsC = () => {
    const newInputFields = [...inputFieldsC];
    newInputFields.pop();
    setInputFieldsC(newInputFields);
  };

  const handleSelectChange = (index, event) => {
    const { name, value } = event;
    const values = [...inputFields];
    values[index][name] = value;
    setInputFields(values);
  };

  const handleSelectChangeC = (index, event) => {
    const { name, value } = event;
    const values = [...inputFieldsC];
    values[index][name] = value;
    setInputFieldsC(values);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  const handleInputChangeC = (index, event) => {
    const { name, value } = event.target;
    const list = [...inputFieldsC];
    list[index][name] = value;
    setInputFieldsC(list);
  };

  const { mutate: addDetailPetty } = useMutation(
    (dataDetail) => postPettyDetail(dataDetail),
    {
      onSuccess: (data) => {
        console.log(data);
        let result = data;
        if (result["message"] == "Save data petty cash success") {
          const btnClose = document.querySelector(".btn-tutup");
          btnClose.click();
          refetch();
          reset();
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
          setErrorDebit(result["message"]);
          setErrorCredit(result["message"]);
        }
      },
    }
  );

  const handleSave = (e) => {
    e.preventDefault();
    let created_by = user.user.name;
    const formData = new FormData();

    formData.append("numberInvoice", numberInvoice);
    formData.append("created_by", created_by);
    formData.append("number", number);

    inputFields.forEach((field, index) => {
      formData.append(`inputFields[${index}][idCoa]`, field.idCoa);
      formData.append(
        `inputFields[${index}][idDepartment]`,
        field.idDepartment
      );
      formData.append(`inputFields[${index}][description]`, field.description);
      formData.append(`inputFields[${index}][debit]`, field.debit);
    });

    inputFieldsC.forEach((field, index) => {
      formData.append(`inputFieldsC[${index}][idCoaC]`, field.idCoaC);
      formData.append(
        `inputFieldsC[${index}][idDepartmentC]`,
        field.idDepartmentC
      );
      formData.append(
        `inputFieldsC[${index}][descriptionC]`,
        field.descriptionC
      );
      formData.append(`inputFieldsC[${index}][credit]`, field.credit);
    });

    for (let i = 0; i < imagesUpload.length; i++) {
      formData.append(`attachPetty[${i}]`, imagesUpload[i]);
    }

    addDetailPetty(formData);
  };

  const balanced = () => {
    let totalDebit = 0.0;
    inputFields.forEach((field) => {
      let Vdebit = field.debit.replace(/,/g, "");
      totalDebit += parseFloat(Vdebit);
    });

    if (totalDebit > lastBallance.balance) {
      setErrorDebit("Balance not enough");
    } else {
      setErrorDebit(null);
    }
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
                <label htmlFor="gambar" className="form-label">
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
                  className={`form-control ${errorImage ? "is-invalid" : null}`}
                  type="file"
                  multiple
                  id="formFile"
                  onChange={(e) => handleImageChange(e)}
                  required
                />
                {errorImage && (
                  <span className="text-danger"> {errorImage} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="invoice" className="form-label">
                  Invoice Number
                </label>
                <input
                  onChange={(e) => setNumberInvoice(e.target.value)}
                  type="text"
                  className={`form-control ${
                    errorInvoice ? "is-invalid" : null
                  }`}
                  id="invoice"
                  placeholder="Enter invoice number"
                />
                {errorInvoice && (
                  <span className="text-danger"> {errorInvoice} </span>
                )}
              </div>

              <hr />

              {inputFields.map((inputField, index) => (
                <div key={index}>
                  <div className="mb-3">
                    <label className="form-label">
                      Account number - name {index + 1}
                    </label>
                    <Select
                      placeholder="Choose COA"
                      name="idCoa"
                      className={errorCoa ? "is-invalid" : null}
                      onChange={(event) => handleSelectChange(index, event)}
                      options={optionsCoa}
                      value={optionsCoa.find(
                        (option) => option.value === inputField.idCoa
                      )}
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
                      name="idDepartment"
                      className={errorDepartment ? "is-invalid" : null}
                      onChange={(event) => handleSelectChange(index, event)}
                      options={optionsDepartment}
                      value={optionsDepartment.find(
                        (option) => option.value === inputField.idDepartment
                      )}
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
                      name="description"
                      onChange={(event) => handleInputChange(index, event)}
                      value={inputField.description}
                    ></textarea>
                    {errorDescription && (
                      <span className="text-danger">{errorDescription}</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Debit {index + 1}</label>
                    <CurrencyFormat
                      className={`form-control ${
                        errorDebit ? "is-invalid" : null
                      }`}
                      thousandSeparator={true}
                      placeholder="Enter Debit"
                      name="debit"
                      onChange={(event) => {
                        handleInputChange(index, event);
                        balanced();
                      }}
                      value={inputField.debit}
                    />
                    {errorDebit && (
                      <span className="text-danger"> {errorDebit} </span>
                    )}
                  </div>
                </div>
              ))}

              {inputFields.length > 1 ? (
                <i
                  className="fa-solid fa-minus btn btn-danger btn-sm"
                  onClick={() => handleRemoveFields()}
                ></i>
              ) : (
                ""
              )}

              <i
                className="fa-solid fa-plus btn btn-primary btn-sm ms-2"
                onClick={() => handleAddFields()}
              ></i>

              <hr />

              {inputFieldsC.map((ifC, index) => (
                <div key={index}>
                  <div className="mb-3 mt-3">
                    <label className="form-label">
                      Account number - name {index + 1}
                    </label>
                    <Select
                      placeholder="Choose COA"
                      className={errorCoaC ? "is-invalid" : null}
                      onChange={(event) => handleSelectChangeC(index, event)}
                      options={optionsCoaC}
                      name="idCoaC"
                      value={optionsCoaC.find(
                        (option) => option.value === ifC.idCoaC
                      )}
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
                      onChange={(event) => handleSelectChangeC(index, event)}
                      name="idDepartmentC"
                      options={optionsDepartmentC}
                      value={optionsDepartmentC.find(
                        (option) => option.value === ifC.idDepartmentC
                      )}
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
                      name="descriptionC"
                      onChange={(event) => handleInputChangeC(index, event)}
                      value={ifC.descriptionC}
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
                      name="credit"
                      onChange={(event) => handleInputChangeC(index, event)}
                      value={ifC.credit}
                    />
                    {errorCredit && (
                      <span className="text-danger"> {errorCredit} </span>
                    )}
                  </div>
                </div>
              ))}

              {inputFieldsC.length > 1 ? (
                <i
                  className="fa-solid fa-minus btn btn-danger btn-sm"
                  onClick={() => handleRemoveFieldsC()}
                ></i>
              ) : null}

              <i
                className="fa-solid fa-plus btn btn-primary btn-sm ms-2"
                onClick={() => handleAddFieldsC()}
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
                onClick={(e) => handleSave(e)}
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
