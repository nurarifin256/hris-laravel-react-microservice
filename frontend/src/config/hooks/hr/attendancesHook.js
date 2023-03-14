export const postAttendance = async (dataDetail) => {
  let result = await fetch("http://localhost:8000/api/save-attendance", {
    method: "POST",
    body: dataDetail,
  });

  result = await result.json();
  return result;
};

export const getAttendances = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  const startDate = queryKey[4];
  const endDate = queryKey[5];
  let response = await fetch(
    `http://localhost:8000/api/get-attendances/${startDate}/${endDate}?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};

export const getAttendace = async ({ queryKey }) => {
  const currentPage = queryKey[1];
  const filter = queryKey[2];
  const perPage = queryKey[3];
  const idEmployee = queryKey[4];
  let response = await fetch(
    `http://localhost:8000/api/get-attendance/${idEmployee}?page=${currentPage}&filter=${filter}&per_page=${perPage}`,
    {
      method: "get",
    }
  );
  response = await response.json();
  return response;
};
