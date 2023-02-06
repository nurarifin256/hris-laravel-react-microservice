import axios from "axios";

const client = axios.create({ baseURL: "http://127.0.0.1:8000/api/" });

export const request = ({ ...options }) => {
  client.defaults.headers.common.Authorization = "Bearer token";
  const onSuccess = (response) => response;
  const onError = (error) => {
    // optional catch error additional loging here
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};
