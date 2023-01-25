import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const Employee = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, sort, filter]);

  const fetchEmployees = () => {
    axios
      .get(
        `http://localhost:8000/api/get-employees?page=${currentPage}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        console.log(response.data.data);
        setEmployees(response.data.data);
        setTotalPages(response.data.meta.last_page);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (column) => {
    setSort({ column: column.path, direction: column.direction });
  };

  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Name department",
      selector: (row, i) => row.departmens.name,
      sortable: true,
    },
    {
      name: "Name position",
      selector: (row, i) => row.departmens.positions.name,
      sortable: true,
    },
    {
      name: "Number phone",
      selector: (row, i) => row.mobile_phone_number,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row, i) => row.gender,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row, i) => row.address,
      sortable: true,
    },
    {
      name: "Identity Card",
      selector: (row, i) => row.identity_card,
      sortable: true,
    },
    {
      name: "Family Card",
      selector: (row, i) => row.family_card,
      sortable: true,
    },
    {
      name: "Certificate",
      selector: (row, i) => row.certificate,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, i) => (
        <div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            //   onClick={() => handleHapus(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            //   onClick={() => handleEdit(row.id)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
            data={employees}
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

export default Employee;
