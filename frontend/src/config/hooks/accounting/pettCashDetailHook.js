export const getPettyDetail = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  const number = queryKey[4];
  let response = await fetch(
    `http://localhost:8000/api/get-petty-cash/${number}?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const postPettyDetail = async (dataDetail) => {
  let result = await fetch("http://localhost:8000/api/save-petty-cash", {
    method: "POST",
    body: dataDetail,
  });

  result = await result.json();
  return result;
};
