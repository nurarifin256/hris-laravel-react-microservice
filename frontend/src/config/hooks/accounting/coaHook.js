export const useCoasData = async () => {
  let response = await fetch("http://localhost:8000/api/get-coas");
  response = await response.json();
  return response;
};
