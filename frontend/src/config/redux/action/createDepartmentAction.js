export async function postDepartmentToAPI(data) {
  let result = await fetch("http://localhost:8000/api/save-department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  result = await result.json();
  return result;
}
