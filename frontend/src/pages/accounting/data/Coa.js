import { useState } from "react";
import { useQuery } from "react-query";
import { getCoasData } from "../../../config/hooks/accounting/coaHook";

const Coa = () => {
  const [coa, setCoa] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const { data, isSuccess } = useQuery(
    ["coas", currentPage, filter, perPage],
    getCoasData
  );

  if (isSuccess) {
    console.log(data);
  }

  return <div>Coa</div>;
};

export default Coa;
