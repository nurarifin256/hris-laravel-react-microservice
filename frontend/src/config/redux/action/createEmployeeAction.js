export async function postEmployee(data) {
  let result = await fetch("http://localhost:8000/api/save-employees", {
    method: "POST",
    body: data,
  });

  result = await result.json();
  return result;
}
