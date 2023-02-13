import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import {
  getCoasData,
  deleteCoaData,
  postCoa,
  getCoaData,
  updateCoa,
} from "../../../config/hooks/accounting/coaHook";
import DataTable from "react-data-table-component";
import CoaPostModal from "./modals/CoaPostModal";
import CoaEditModal from "./modals/CoaEditModal";
import "react-toastify/dist/ReactToastify.css";

const Coa = () => {
  const [coa, setCoa] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [idEdit, setIdEdit] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { refetch } = useQuery(
    ["coas", currentPage, filter, perPage],
    getCoasData,
    {
      onSuccess: (data) => {
        setCoa(data.data);
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
      name: "Account Number",
      selector: (row, i) => row.account_number,
      sortable: true,
    },
    {
      name: "Account Name",
      selector: (row, i) => row.account_name,
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
            onClick={() => handleHapus(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            onClick={() => {
              setShowModal(true);
              setIdEdit(row.id);
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
    },
  ];

  const { mutate: hapusBackend } = useMutation((id) => deleteCoaData(id), {
    onSuccess(data) {
      if (data.message == "Delete data coa success") {
        refetch();
        toast.success("Delete data coa success", {
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
  });

  const handleHapus = (id) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => hapusBackend(id),
        },
        {
          label: "No",
          // onClick: () => onClose(),
        },
      ],
    });
  };

  if (showModal) {
    const btnEdit = document.querySelector(".btn-edit");
    btnEdit.click();
  }

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
            data={coa}
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
      <CoaPostModal refetch={refetch} postCoa={postCoa} />
      {/* modal edit */}
      <CoaEditModal
        id={idEdit}
        refetch={refetch}
        getCoaData={getCoaData}
        updateCoa={updateCoa}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Coa;
