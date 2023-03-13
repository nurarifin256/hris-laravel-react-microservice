export const postAttendance = async (dataDetail) => {
  let result = await fetch("http://localhost:8000/api/save-attendance", {
    method: "POST",
    body: dataDetail,
  });

  result = await result.json();
  return result;
};
