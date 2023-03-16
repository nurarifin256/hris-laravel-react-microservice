let user = JSON.parse(localStorage.getItem("user"));

export const getPayrolls = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  let response = await fetch(
    `http://localhost:8000/api/get-payrolls?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const postPayroll = async (formData) => {
  let response = await fetch("http://localhost:8000/api/save-payroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  response = await response.json();
  return response;
};
