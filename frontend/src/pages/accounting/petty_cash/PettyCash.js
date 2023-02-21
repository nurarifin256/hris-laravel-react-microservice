import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  getPettyDetail,
  postPettyDetail,
} from "../../../config/hooks/accounting/pettCashDetailHook";
import DataTable from "react-data-table-component";
import moment from "moment";
import PettyCashPostModal from "./modals/PettyCashPostModal";

const PettyCash = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const { number } = useParams();
  const [pettyCash, setPettyCash] = useState([]);
  const [coa, setCoa] = useState([]);
  const [department, setDepartment] = useState([]);

  const numberFormat = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const { refetch } = useQuery(
    ["pettyCash", currentPage, filter, perPage, number],
    getPettyDetail,
    {
      onSuccess: (data) => {
        setPettyCash(data.data);
        setCoa(data.coasData);
        setDepartment(data.departmentData);
        setTotalPages(data.meta.last_page);
        // console.log(data);
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
    },
    {
      name: "Date",
      selector: (row, i) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Journal Number",
      selector: (row, i) => row.number_journal,
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
    },
    {
      name: "Departments",
      selector: (row, i) =>
        row.departmens.name + " - " + row.departmens.positions.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Description",
      selector: (row, i) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Debit",
      selector: (row, i) => numberFormat(row.debit),
      sortable: true,
    },
    {
      name: "Credit",
      selector: (row, i) => numberFormat(row.credit),
      sortable: true,
    },
    {
      name: "Balance",
      selector: (row, i) => numberFormat(row.balance),
      sortable: true,
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
            // onClick={() => handleHapus(row.number)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            // onClick={() => setNumber(row.number)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
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
              defaultSortAsc={true}
            />
          </div>
        </div>
        <ToastContainer />
      </div>

      {/* modal add */}
      <PettyCashPostModal
        coas={coa}
        department={department}
        refetch={refetch}
        postPettyDetail={postPettyDetail}
        number={number}
      />

      {/* modal edit */}
      {/* <RefillEditModal
        coas={coa}
        department={department}
        refetch={refetch}
        getRefill={getRefill}
        number={number}
        updateRefill={updateRefill}
      /> */}
    </div>
  );
};

export default PettyCash;
