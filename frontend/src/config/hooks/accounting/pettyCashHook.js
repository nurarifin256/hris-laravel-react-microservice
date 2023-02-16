let user = JSON.parse(localStorage.getItem("user"));

export const getPettyCashData = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  let response = await fetch(
    `http://localhost:8000/api/get-refill?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const postRefill = async (dataRefill) => {
  let response = await fetch("http://localhost:8000/api/save-refill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataRefill),
  });
  response = await response.json();
  return response;
};

export const deleteRefill = async (number) => {
  const updated_by = user.user.name;
  let data = { number, updated_by };
  let response = await fetch("http://localhost:8000/api/delete-refill", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  return response;
};
