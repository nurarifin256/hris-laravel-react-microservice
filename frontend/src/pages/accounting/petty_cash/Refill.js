import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import { getPettyCashData } from "../../../config/hooks/accounting/pettyCashHook";

const Refill = () => {
  const [coa, setCoa] = useState([]);
  const [department, setDepartment] = useState([]);
  const [pettyCash, setPettyCash] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const { refetch } = useQuery(
    ["pettyCash", currentPage, filter, perPage],
    getPettyCashData,
    {
      onSuccess: (data) => {
        setPettyCash(data.data);
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
    },
    {
      name: "Journal Number",
      selector: (row, i) => row.number,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row, i) => row.description,
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
            // onClick={() => handleHapus(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            onClick={() => {
              //   setShowModal(true);
              //   setIdEdit(row.id);
            }}
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
          <DataTable
            columns={columns}
            data={pettyCash}
            pagination
            paginationServer
            paginationTotalRows={totalPages * perPage}
            onChangePage={handlePageChange}
            onSort={handleSort}
          />
        </div>
        <ToastContainer />
      </div>

      {/* modal add */}
      {/* <CoaPostModal refetch={refetch} postCoa={postCoa} /> */}
      {/* modal edit */}
      {/* <CoaEditModal
        id={idEdit}
        refetch={refetch}
        getCoaData={getCoaData}
        updateCoa={updateCoa}
        onClose={() => setShowModal(false)}
      /> */}
    </div>
  );
};

export default Refill;
