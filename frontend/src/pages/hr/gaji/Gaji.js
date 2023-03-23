import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import {
  getPayrolls,
  postPayroll,
  generatePayroll,
  postGeneratePayroll,
  getHistoriesPayrolls,
  getDetailPayroll,
  deleteDetailPayroll,
} from "../../../config/hooks/hr/payrollsHook";
import DataTable from "react-data-table-component";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import Select from "react-select";
import GajiPostModal from "./modals/GajiPostModal";
import GenerateGajiModal from "./modals/GenerateGajiModal";
import HistoryGajiModal from "./modals/HistoryGajiModal";
import { confirmAlert } from "react-confirm-alert";

const Gaji = () => {
  const numberFormat = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [filter, setFilter] = useState("");

  const [currentPageH, setCurrentPageH] = useState(1);
  const [totalPagesH, setTotalPagesH] = useState(0);
  const [perPageH] = useState(15);
  const [filterH, setFilterH] = useState("");

  const [sort, setSort] = useState({ column: "", direction: "" });

  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [payrollHistories, setPayrollHistories] = useState([]);

  const [idPayrollHistory, setIdPayrollHistory] = useState(null);

  // cara mutliple kirim parameter
  // const initialState = {
  //   idEmployee: "",
  //   id: "",
  //   salary: "",
  // };
  // const [formData, setFormData] = useState(initialState);

  const [id, setId] = useState(null);

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

  const { refetch: reload } = useQuery(
    ["payrollHistories", currentPageH, filterH, perPageH],
    getHistoriesPayrolls,
    {
      onSuccess: (data) => {
        setPayrollHistories(data.data);
        setTotalPagesH(data.meta.last_page);
      },
    }
  );

  const handleFilter = (e, flag) => {
    if (flag === "P") {
      setFilter(e.target.value);
    } else {
      setFilterH(e.target.value);
    }
  };

  const handlePageChange = (e, flag, page) => {
    if (flag === "P") {
      setCurrentPage(page);
    } else {
      setCurrentPageH(page);
    }
  };

  const handleSort = (column) => {
    setSort({ column: column.path, direction: column.direction });
  };

  const { mutate: deleteBackend } = useMutation(
    (id) => deleteDetailPayroll(id),
    {
      onSuccess(data) {
        if (data.message === "History payroll success deleted") {
          reload();
          toast.success(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      },
    }
  );

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteBackend(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row, i) => row.employees.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Department & Position",
      selector: (row, i) =>
        row.employees.departmens.name +
        " - " +
        row.employees.departmens.positions.name,
      sortable: true,
    },
    {
      name: "Basic Sallary",
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
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#modal-generate"
              // cara isi initialState
              // onClick={() =>
              //   setFormData({
              //     idEmployee: row.id_employee,
              //     id: row.id,
              //     salary: row.basic_salary,
              //   })
              // }

              onClick={() => setId(row.id)}
            >
              Generate
            </button>
          </div>
        </div>
      ),
    },
  ];

  const columnsHistories = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row, i) => row.payrolls.employees.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Department & Position",
      selector: (row, i) =>
        row.payrolls.employees.departmens.name +
        " - " +
        row.payrolls.employees.departmens.positions.name,
      sortable: true,
    },
    {
      name: "Periode",
      selector: (row, i) => moment(row.periode).format("MM - YYYY"),
      sortable: true,
    },
    {
      name: "Net Salary",
      sortable: true,
      selector: (row, i) => numberFormat(row.nett_salary),
    },
    {
      name: "Action",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row, i) => (
        <div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-info btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-detail"
            onClick={() => setIdPayrollHistory(row.id)}
          >
            <i className="fa-solid fa-eye"></i>
          </button>
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
              onChange={(e) => handleFilter(e, "P")}
            />
          </div>
        </div>

        {/* tabel master gaji */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <DataTable
                data={payrolls}
                columns={columns}
                pagination
                paginationServer
                paginationTotalRows={totalPages * perPage}
                onChangePage={(e) => handlePageChange(e, "P")}
                onSort={handleSort}
              />
            </div>
          </div>
        </div>

        {/* tabel history gaji */}
        <div className="row">
          <div className="col-md-3 mb-3">
            <h4 className="mb-3">Payroll Histories</h4>
          </div>
          <div className="col-md-3 offset-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              onChange={(e) => handleFilter(e, "H")}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <DataTable
                data={payrollHistories}
                columns={columnsHistories}
                pagination
                paginationServer
                paginationTotalRows={totalPagesH * perPageH}
                onChangePage={(e) => handlePageChange(e, "H")}
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
          refetch={refetch}
          toast={toast}
          useMutation={useMutation}
        />

        {/* modal generate */}
        <GenerateGajiModal
          id={id}
          generatePayroll={generatePayroll}
          numberFormat={numberFormat}
          postGeneratePayroll={postGeneratePayroll}
          toast={toast}
          reload={reload}
        />

        {/* modal detail gaji */}
        <HistoryGajiModal
          idPayrollHistory={idPayrollHistory}
          getDetailPayroll={getDetailPayroll}
          numberFormat={numberFormat}
        />

        <ToastContainer />
      </div>
    </>
  );
};

export default Gaji;
