import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import { getPayrolls } from "../../../config/hooks/hr/payrollsHook";

const Gaji = () => {
  const numberFormat = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const { refetch } = useQuery(
    ["payrolls", currentPage, filter, perPage],
    getPayrolls,
    {
      onSuccess: (data) => {
        console.log(data);
        setPayrolls(data.data);
        setEmployees(data.employeeData);
      },
    }
  );

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
      selector: (row, i) => row.employees.name,
      sortable: true,
    },
    {
      name: "Sallary",
      selector: (row, i) => numberFormat(row.basic_salary),
      sortable: true,
    },
    {
      name: "Action",
      ignoreRowClick: true,
      allowOverflow: true,
      width: "320px",
      // button: true,
      cell: (row, i) => (
        <div>
          <div
            className="btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <button type="button" className="btn btn-danger">
              Delete
            </button>
            <button type="button" className="btn btn-warning">
              Edit
            </button>
            <button type="button" className="btn btn-success">
              Generate
            </button>
          </div>
          {/* <button
            type="button"
            className="btn btn-danger btn-sm ms-2"
            // onClick={() => handleHapus(row.number)}
          >
            <i className="fa-solid fa-trash-can"></i> Generate
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            // onClick={() => handleHapus(row.number)}
          >
            <i className="fa-solid fa-trash-can"></i> Delete
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            // onClick={() => setNumber(row.number)}
          >
            <i className="fa-solid fa-pen-to-square"></i> Edit
          </button> */}
        </div>
      ),
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
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <DataTable
              data={payrolls}
              columns={columns}
              pagination
              paginationServer
              paginationTotalRows={totalPages * perPage}
              onChangePage={handlePageChange}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gaji;
