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

export const getHistoriesPayrolls = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  let response = await fetch(
    `http://localhost:8000/api/get-history-payrolls?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const generatePayroll = async ({ queryKey }) => {
  let id = queryKey[1];
  let response = await fetch("http://localhost:8000/api/generate-payroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  response = await response.json();
  return response;
};

export const postPayroll = async (formData) => {
  let created_by = user.user.name;
  let data = { ...formData, created_by };
  let response = await fetch("http://localhost:8000/api/save-payroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  return response;
};

export const postGeneratePayroll = async (dataGenerate) => {
  let created_by = user.user.name;
  let data = { ...dataGenerate, created_by };
  let response = await fetch(
    "http://localhost:8000/api/save-generate-payroll",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  response = await response.json();
  return response;
};
