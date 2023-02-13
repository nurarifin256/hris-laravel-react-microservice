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
