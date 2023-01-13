import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const navigate = useNavigate();

  async function Save() {
    let data = { name, email, password };
    let result = await fetch("http://localhost:8000/api/register-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    if (
      result["name"] == "Name is required" ||
      result["email"] == "Email is required" ||
      result["email"] == "Email is not valid" ||
      result["email"] == "Email already exists" ||
      result["password"] == "Password is required"
    ) {
      setErrorMessage(result["name"]);
      setErrorMessageEmail(result["email"]);
      setErrorMessagePassword(result["password"]);
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="row mt-3">
      <div className="col-md-6 offset-md-3 mx-auto">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${errorMessage ? "is-invalid" : null}`}
            autoFocus
          />
          {errorMessage && (
            <span className="text-danger"> {errorMessage} </span>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${
              errorMessageEmail ? "is-invalid" : null
            }`}
          />
          {errorMessageEmail && (
            <span className="text-danger"> {errorMessageEmail} </span>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${
              errorMessagePassword ? "is-invalid" : null
            }`}
          />
          {errorMessagePassword && (
            <span className="text-danger"> {errorMessagePassword} </span>
          )}
        </div>
        <button type="button" onClick={Save} className="btn btn-primary">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
