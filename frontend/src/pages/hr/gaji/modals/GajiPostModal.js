import React, { useState } from "react";

const GajiPostModal = ({ employees, Select, CurrencyFormat }) => {
  const [errors, setErrors] = useState({
    employee: null,
    salary: null,
    transport: null,
    positional: null,
    periode: null,
  });

  const initialState = {
    idEmployee: "",
    salary: "",
    transport: "",
    positional: "",
    periode: "",
  };

  const [formData, setFormData] = useState(initialState);

  const optionsEmployee = employees.map((item) => {
    return {
      label: item.name,
      value: item.id,
      name: "idEmployee",
    };
  });

  const handleChange = (e, flag) => {
    const { name, value } = flag === "s" ? e : e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSave = () => {
    console.log(formData);
  };
  //   console.log(formData);
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
                  placeholder="Choose Employee"
                  className={errors.employee ? "is-invalid" : null}
                  onChange={(e) => handleChange(e, "s")}
                  options={optionsEmployee}
                  name="idEmployee"
                />
                {errors.employee && (
                  <span className="text-danger"> {errors.employee} </span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Basic Salary</label>
                <CurrencyFormat
                  className={`form-control ${
                    errors.salary ? "is-invalid" : null
                  }`}
                  thousandSeparator={true}
                  placeholder="Enter Basic Salary"
                  onChange={(e) => handleChange(e, "i")}
                  name="salary"
                />
                {errors.salary && (
                  <span className="text-danger"> {errors.salary} </span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Transportation Allowance</label>
                <CurrencyFormat
                  className={`form-control ${
                    errors.transport ? "is-invalid" : null
                  }`}
                  thousandSeparator={true}
                  placeholder="Enter Transport Allowance"
                  onChange={(e) => handleChange(e, "i")}
                  name="transport"
                />
                {errors.transport && (
                  <span className="text-danger"> {errors.transport} </span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Positional Allowance</label>
                <CurrencyFormat
                  className={`form-control ${
                    errors.positional ? "is-invalid" : null
                  }`}
                  thousandSeparator={true}
                  placeholder="Enter Positional Allowance"
                  onChange={(e) => handleChange(e, "i")}
                  name="positional"
                />
                {errors.positional && (
                  <span className="text-danger"> {errors.positional} </span>
                )}
              </div>

              <div className="mb-3">
                <div className="form-label">Periode</div>
                <input
                  type="date"
                  className={`form-control ${
                    errors.periode ? "is-invalid" : null
                  }`}
                  name="periode"
                  onChange={(e) => handleChange(e, "i")}
                />
                {errors.periode && (
                  <span className="text-danger"> {errors.periode} </span>
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

export default GajiPostModal;
