import React, { useState } from "react";
import { useMutation } from "react-query";

const GajiPostModal = ({ employees, Select, CurrencyFormat, postPayroll }) => {
  const [errors, setErrors] = useState({
    employee: null,
    salary: null,
    transport: null,
    positional: null,
  });

  const initialState = {
    idEmployee: "",
    salary: "",
    transport: "",
    positional: "",
  };

  const [formData, setFormData] = useState(initialState);

  const optionsEmployee = employees.map((item) => {
    return {
      label:
        item.name +
        " - " +
        item.departmens.name +
        " - " +
        item.departmens.positions.name,
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

  const { mutate: addPayroll } = useMutation(
    (formData) => postPayroll(formData),
    {
      onSuccess: (data) => {
        let result = data;
        if (
          result["idEmployee"] == "Employee is required" ||
          result["salary"] == "Salary is required" ||
          result["transport"] == "Transport allowance is required" ||
          result["positional"] == "Positional allowance is required"
        ) {
          setErrors({
            ...errors,
            employee: result["idEmployee"],
            salary: result["salary"],
            transport: result["transport"],
            positional: result["positional"],
          });
        }
      },
    }
  );

  const handleSave = () => {
    addPayroll(formData);
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
