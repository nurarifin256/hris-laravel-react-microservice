import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Position = () => {
  const [positions, setPosition] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    fetchUser();
  }, [currentPage, sort, filter]);

  const fetchUser = () => {
    axios
      .get(
        `http://localhost:8000/api/get-position?page=${currentPage}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        setPosition(response.data.data);
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

  const handleHapus = () => {};

  async function handleSave() {
    if (name == "") {
      setErrorName("Name is required");
    } else {
      let user = JSON.parse(localStorage.getItem("user"));
      let created_by = user.user.name;
      let item = { name, created_by };
      await fetch("http://localhost:8000/api/save-position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const btnClose = document.querySelector(".btn-tutup");
      btnClose.click();
      fetchUser();
      toast.success("Save data position success", {
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
  }

  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
    },
    {
      name: "Name",
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: () => (
        <div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
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

        <div className="col-md-6">
          <DataTable
            columns={columns}
            data={positions}
            pagination
            paginationServer
            paginationTotalRows={totalPages * perPage}
            onChangePage={handlePageChange}
            onSort={handleSort}
          />
        </div>
        <ToastContainer />
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

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
                <label htmlFor="name" className="form-label">
                  Name Position
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter name"
                />
                {errorName && (
                  <span className="text-danger"> {errorName} </span>
                )}
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
                  onClick={handleSave}
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

export default Position;
