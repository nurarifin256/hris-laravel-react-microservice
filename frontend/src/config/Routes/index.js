import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../../components/parts/Navbar";
import {
  Position,
  Login,
  Register,
  Dashboard,
  Logout,
  Departement,
  Employee,
} from "../../pages";

const Routess = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Dashboard />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/employee/position" element={<Position />}></Route>
        <Route exact path="/employee/employee" element={<Employee />}></Route>
        <Route
          exact
          path="/employee/department"
          element={<Departement />}
        ></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
      </Routes>
    </Router>
  );
};

export default Routess;
