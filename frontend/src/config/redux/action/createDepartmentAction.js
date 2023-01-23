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

export async function deleteDepartment(data) {
  let result = await fetch("http://localhost:8000/api/delete-department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  result = await result.json();
  return result;
}

export async function editDepartment(data) {
  let result = await fetch("http://localhost:8000/api/edit-department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  result = await result.json();
  return result;
}

export async function updateDepartment(data) {
  let result = await fetch("http://localhost:8000/api/update-department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  result = await result.json();
  return result;
}
