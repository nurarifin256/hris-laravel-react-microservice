import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../../components/parts/Navbar";
import { Position, Login } from "../../pages";

const Routess = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/employee/position" element={<Position />}></Route>
      </Routes>
    </Router>
  );
};

export default Routess;
