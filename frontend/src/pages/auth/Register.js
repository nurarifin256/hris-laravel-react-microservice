import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function Save() {
    if (name == "") {
      setErrorMessage("Name is required");
    } else {
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
            className="form-control"
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
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="button" onClick={Save} className="btn btn-primary">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
