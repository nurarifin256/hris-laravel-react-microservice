import { useQuery } from "react-query";
import { request } from "../../../utils/axios-utils";

const fethEmployee = () => {
  return request({ url: "/get-employees" });
};

// export const useEmployeeData = () => {
//   return useQuery("employee", fethEmployee);
// };

export const getEmployeeData = async (id) => {
  let data = { id };
  let response = await fetch("http://localhost:8000/api/edit-employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  return response;
};
