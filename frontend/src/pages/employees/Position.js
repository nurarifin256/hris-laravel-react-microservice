import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Position = () => {
  const [positions, setPosition] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchUser();
  }, [currentPage, sort, filter]);

  const fetchUser = () => {
    axios
      .get(
        `http://localhost:8000/api/get-position?page=${currentPage}&sort_by=${sort.column}&sort_dir=${sort.direction}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        setPosition(response.data.data);
        setTotalPages(response.data.meta.last_page);

        console.warn("Request " + response.data.request);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (column) => {
    setSort({ column: column.path, direction: column.direction });
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
    },
    {
      name: "Name",
      selector: (row, i) => row.name,
      sortable: true,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3 offset-md-9 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={handleFilter}
          />
        </div>

        <div className="col-md-12">
          <DataTable
            columns={columns}
            data={positions}
            pagination
            paginationServer
            paginationTotalRows={totalPages * perPage}
            onChangePage={handlePageChange}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
};

export default Position;
