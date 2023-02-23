import { useState } from "react";
import DataTable from "react-data-table-component";
import { useMutation, useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import {
  getPettyCashData,
  postRefill,
  deleteRefill,
  getRefill,
  updateRefill,
} from "../../../config/hooks/accounting/pettyCashHook";
import "./style.css";
import RefillPostModal from "./modals/RefillPostModal";
import RefillEditModal from "./modals/RefillEditModal";
import { Link } from "react-router-dom";
import moment from "moment";

const Refill = () => {
  const [coa, setCoa] = useState([]);
  const [department, setDepartment] = useState([]);
  const [pettyCash, setPettyCash] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [number, setNumber] = useState("0");

  const numberFormat = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const { refetch } = useQuery(
    ["pettyCash", currentPage, filter, perPage],
    getPettyCashData,
    {
      onSuccess: (data) => {
        setPettyCash(data.data);
        setCoa(data.coasData);
        setDepartment(data.departmentData);
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
      name: "",
      cell: (row, i) => (
        <div>
          <input
            className="form-check-input"
            type="checkbox"
            value={row.id}
            id="flexCheckDefault"
          ></input>
        </div>
      ),
      width: "25px",
    },
    {
      name: "Date",
      selector: (row, i) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
      wrap: true,
      width: "100px",
    },
    {
      name: "Journal Number",
      cell: (row, i) => (
        <Link to={`/acounting/petty-cash/${row.number}`}>{row.number}</Link>
      ),
      sortable: true,
    },
    {
      name: "Account Number",
      selector: (row, i) => row.coas.account_number,
      sortable: true,
    },
    {
      name: "Account Name",
      selector: (row, i) => row.coas.account_name,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Departments",
      selector: (row, i) =>
        row.departmens.name + " - " + row.departmens.positions.name,
      sortable: true,
      wrap: true,
      width: "180px",
    },

    {
      name: "Description",
      selector: (row, i) => row.description,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Debit",
      selector: (row, i) => numberFormat(row.debit),
      sortable: true,
      width: "150px",
    },
    {
      name: "Credit",
      selector: (row, i) => numberFormat(row.credit),
      sortable: true,
      width: "150px",
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
            onClick={() => handleHapus(row.number)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            onClick={() => setNumber(row.number)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.debit < 1.0,
      style: {
        backgroundColor: "green",
        color: "white",
      },
    },
  ];

  const { mutate: hapusBackend } = useMutation(
    (number) => deleteRefill(number),
    {
      onSuccess(data) {
        if (data.message == "Delete data refill success") {
          refetch();
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

  const handleHapus = (number) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => hapusBackend(number),
        },
        {
          label: "No",
          // onClick: () => onClose(),
        },
      ],
    });
  };

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

          <button
            type="button"
            className="btn btn-primary btn-edit"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
          >
            tes
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
              columns={columns}
              data={pettyCash}
              pagination
              paginationServer
              paginationTotalRows={totalPages * perPage}
              onChangePage={handlePageChange}
              onSort={handleSort}
              conditionalRowStyles={conditionalRowStyles}
            />
          </div>
        </div>
        <ToastContainer />
      </div>

      {/* modal add */}
      <RefillPostModal
        coas={coa}
        department={department}
        refetch={refetch}
        postRefill={postRefill}
      />

      {/* modal edit */}
      <RefillEditModal
        coas={coa}
        department={department}
        refetch={refetch}
        getRefill={getRefill}
        number={number}
        updateRefill={updateRefill}
      />
    </div>
  );
};

export default Refill;
