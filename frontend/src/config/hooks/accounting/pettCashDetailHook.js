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

export const deletePettyDetail = async (dataDelete) => {
  let result = await fetch("http://localhost:8000/api/delete-petty-cash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataDelete),
  });

  result = await result.json();
  return result;
};

export const postPettyDetail = async (dataDetail) => {
  let result = await fetch("http://localhost:8000/api/save-petty-cash", {
    method: "POST",
    body: dataDetail,
  });

  result = await result.json();
  return result;
};

export const getAttachment = async ({ queryKey }) => {
  const numberJournal = queryKey[1];
  let response = await fetch("http://localhost:8000/api/get-attachment-petty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(numberJournal),
  });
  response = await response.json();
  return response;
};

export const deleteAttach = async (dataAttach) => {
  let response = await fetch(
    "http://localhost:8000/api/delete-attachment-petty",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataAttach),
    }
  );
  response = await response.json();
  return response;
};

export const addPettyAttach = async (attach) => {
  let result = await fetch("http://localhost:8000/api/add-attachment-petty", {
    method: "POST",
    body: attach,
  });

  result = await result.json();
  return result;
};
