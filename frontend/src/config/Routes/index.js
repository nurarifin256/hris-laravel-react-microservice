import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../../components/parts/Navbar";
import { Position, Login, Register } from "../../pages";

const Routess = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/employee/position" element={<Position />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
};

export default Routess;
