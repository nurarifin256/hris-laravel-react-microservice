import React from "react";

const Dashboard = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  return <div>Hallo {user.user.name}</div>;
};

export default Dashboard;
