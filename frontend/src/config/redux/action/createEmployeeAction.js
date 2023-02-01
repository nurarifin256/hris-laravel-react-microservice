export async function postEmployee(data) {
  let result = await fetch("http://localhost:8000/api/save-employees", {
    method: "POST",
    body: data,
  });

  result = await result.json();
  return result;
}

export async function deleteEmployee(data) {
  let result = await fetch("http://localhost:8000/api/delete-employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  result = await result.json();
  return result;
}
