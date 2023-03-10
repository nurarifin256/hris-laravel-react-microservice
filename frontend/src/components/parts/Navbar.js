import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          HRIS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Employees
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="employee/employee">
                    employee
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="employee/department">
                    Department
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="employee/position">
                    Position
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Human Resources
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="hr/gaji">
                    Payroll
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="hr/attendance">
                    Attendance
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Accounting
              </Link>

              <ul className="dropdown-menu">
                <li>
                  <div className="dropdown-item dropend">
                    <Link
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Data
                    </Link>

                    <ul className="dropdown-menu dropdown-menu-sub">
                      <Link className="dropdown-item" to="acounting/coa">
                        Chart of Account
                      </Link>
                    </ul>
                  </div>

                  <div className="dropdown-item dropend">
                    <Link
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Petty Cash
                    </Link>

                    <ul className="dropdown-menu dropdown-menu-sub">
                      <Link className="dropdown-item" to="acounting/refill">
                        Journal Entry
                      </Link>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>

            {localStorage.getItem("user") ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
