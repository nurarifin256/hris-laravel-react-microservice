import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/parts/Navbar";
import Position from "./pages/employees/Position";
import Login from "./pages/auth/Login";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/employee/position" element={<Position />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
