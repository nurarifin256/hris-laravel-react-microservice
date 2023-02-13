let user = JSON.parse(localStorage.getItem("user"));

export const getCoasData = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  let response = await fetch(
    `http://localhost:8000/api/get-coas?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const getCoaData = async ({ queryKey }) => {
  const id = queryKey[1];

  let response = await fetch(`http://localhost:8000/api/edit-coa/${id}`, {
    method: "get",
  });
  response = await response.json();
  return response;
};

export const deleteCoaData = async (id) => {
  let updated_by = user.user.name;
  let data = { id, updated_by };
  let response = await fetch("http://localhost:8000/api/delete-coa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  return response;
};

export const postCoa = async (dataCoa) => {
  let response = await fetch("http://localhost:8000/api/save-coa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataCoa),
  });
  response = await response.json();
  return response;
};
