import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import {
  getCoasData,
  deleteCoaData,
  postCoa,
} from "../../../config/hooks/accounting/coaHook";
import DataTable from "react-data-table-component";
import "react-toastify/dist/ReactToastify.css";

const Coa = () => {
  let user = JSON.parse(localStorage.getItem("user"));

  const [coa, setCoa] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [account_number, setAccountNumber] = useState("");
  const [account_name, setAccountName] = useState("");
  const [errorNumber, setErrorNumber] = useState("");
  const [errorName, setErrorName] = useState("");

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
            // onClick={() => handleEdit(row.id)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
    },
  ];

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

  const { mutate: addCoa } = useMutation((dataCoa) => postCoa(dataCoa), {
    onSuccess: (data) => {
      let result = data;
      if (
        result["account_name"] == "Account name is required" ||
        result["account_number"] == "Account number already exists" ||
        result["account_number"] == "Account number is required"
      ) {
        setErrorNumber(result["account_number"]);
        setErrorName(result["account_name"]);
      } else {
        const btnClose = document.querySelector(".btn-tutup");
        btnClose.click();
        refetch();
        toast.success(result["message"], {
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

  const handleSave = () => {
    let created_by = user.user.name;
    const dataCoa = { account_number, account_name, created_by };
    addCoa(dataCoa);
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
            className="btn-edit"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
          ></button>
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
      <div>
        <div
          className="modal fade"
          id="modal-add"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add Data
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Account Number
                  </label>
                  <input
                    value={account_number}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    type="text"
                    className={`form-control ${
                      errorNumber ? "is-invalid" : null
                    }`}
                    id="name"
                    placeholder="Enter account number"
                  />
                  {errorNumber && (
                    <span className="text-danger"> {errorNumber} </span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Account Name
                  </label>
                  <input
                    value={account_name}
                    onChange={(e) => setAccountName(e.target.value)}
                    type="text"
                    className={`form-control ${
                      errorName ? "is-invalid" : null
                    }`}
                    id="name"
                    placeholder="Enter account name"
                  />
                  {errorName && (
                    <span className="text-danger"> {errorName} </span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-tutup"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coa;
