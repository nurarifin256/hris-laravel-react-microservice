import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  async function Login() {
    let data = { email, password };
    let result = await fetch("http://localhost:8000/api/login-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    if (
      result["email"] == "Email is required" ||
      result["email"] == "Email not valid" ||
      result["password"] == "Password is required"
    ) {
      setErrorEmail(result["email"]);
      setErrorPassword(result["password"]);
    } else {
      if (
        result["messageEmail"] == "Email not registered" ||
        result["messagePassword"] == "Password is incorrect"
      ) {
        setErrorEmail(result["messageEmail"]);
        setErrorPassword(result["messagePassword"]);
      } else {
        localStorage.setItem("user", JSON.stringify(result));
        navigate("/");
      }
    }
  }

  return (
    <div className="row mt-3">
      <div className="col-md-6 offset-md-3 mx-auto">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${errorEmail ? "is-invalid" : null}`}
          />
          {errorEmail && <span className="text-danger"> {errorEmail} </span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errorPassword ? "is-invalid" : null}`}
          />
          {errorPassword && (
            <span className="text-danger"> {errorPassword} </span>
          )}
        </div>
        <button type="button" onClick={Login} className="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
