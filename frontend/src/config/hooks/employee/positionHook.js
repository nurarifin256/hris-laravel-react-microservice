import { useQuery } from "react-query";
import { request } from "../../../utils/axios-utils";

const fetchPositions = () => {
  return request({ url: "/get-position" });
};

const fetchPosition = () => {
  return request({ url: "/get-position" });
};

export const usePositionData = () => {
  return useQuery("positions", fetchPositions);
};

export const useGetPosition = () => {
  return useQuery("position", fetchPosition);
};
