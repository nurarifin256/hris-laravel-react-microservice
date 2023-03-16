import { useState } from "react";
import { useQuery } from "react-query";
import {
  getPayrolls,
  postPayroll,
} from "../../../config/hooks/hr/payrollsHook";
import DataTable from "react-data-table-component";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import Select from "react-select";
import GajiPostModal from "./modals/GajiPostModal";

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
        setPayrolls(data.data);
        setEmployees(data.employeeData);
        setTotalPages(data.meta.last_page);
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
        </div>
      ),
    },
  ];

  return (
    <>
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

        {/* modal add */}
        <GajiPostModal
          employees={employees}
          Select={Select}
          CurrencyFormat={CurrencyFormat}
          postPayroll={postPayroll}
        />
      </div>
    </>
  );
};

export default Gaji;
