import axios from "axios";
import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";

const Departement = () => {
  const [department, setDepartment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchDepartment();
  }, [currentPage, sort, filter]);

  const fetchDepartment = () => {
    axios
      .get(
        `http://localhost:8000/api/get-department?page=${currentPage}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        console.log(response.data.data);
        setDepartment(response.data.data);
        setTotalPages(response.data.meta.last_page);
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
      name: "Name Department",
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Name Position",
      selector: (row, i) => row.positions.name,
      sortable: true,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3 mb-3">
          <button
            type="button"
            className="btn btn-primary btn-md"
            data-bs-toggle="modal"
            data-bs-target="#modal-add"
          >
            <i className="fa-solid fa-plus"></i> Add
          </button>
        </div>
        <div className="col-md-3 offset-md-6 mb-3">
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
            data={department}
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

export default Departement;
