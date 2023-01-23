import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./position.css";

const Position = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [positions, setPosition] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [name, setName] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [idPosition, setIdPosition] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorNameEdit, setErrorNameEdit] = useState("");

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
            onClick={() => handleEdit(row.id)}
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

  async function hapusBackend(id) {
    let updated_by = user.user.name;
    let data = { id, updated_by };

    let result = await fetch("http://localhost:8000/api/delete-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await result.json();
    if (result["message"] == "Delete data position success") {
      fetchUser();
      toast.success("Delete data position success", {
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

  async function handleEdit(id) {
    let data = { id };
    let result = await fetch("http://localhost:8000/api/edit-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    if (result["message"] == "success") {
      setNameEdit(result["userData"]["name"]);
      setIdPosition(result["userData"]["id"]);
      const btnEdit = document.querySelector(".btn-edit");
      btnEdit.click();
    }
  }

  async function handleUpdate() {
    let updated_by = user.user.name;
    let name = nameEdit;
    let data = { idPosition, name, updated_by };

    let result = await fetch("http://localhost:8000/api/update-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    if (
      result["name"] == "Name is required" ||
      result["name"] == "Name already exists"
    ) {
      setErrorNameEdit(result["name"]);
    } else {
      const btnClose = document.querySelector(".btn-tutup-update");
      btnClose.click();
      fetchUser();
      toast.success("Update data position success", {
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

  async function handleSave() {
    let created_by = user.user.name;
    let data = { name, created_by };

    let result = await fetch("http://localhost:8000/api/save-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await result.json();
    if (
      result["name"] == "Name is required" ||
      result["name"] == "Name already exists"
    ) {
      setErrorName(result["name"]);
    } else {
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
                <label htmlFor="name" className="form-label">
                  Name Position
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className={`form-control ${errorName ? "is-invalid" : null}`}
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

      {/* modal edit */}
      <div>
        <div
          className="modal fade"
          id="modal-edit"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Edit Data
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
                  type="text"
                  value={nameEdit}
                  onChange={(e) => setNameEdit(e.target.value)}
                  className={`form-control ${
                    errorNameEdit ? "is-invalid" : null
                  }`}
                  placeholder="Enter name"
                />
                {errorNameEdit && (
                  <span className="text-danger"> {errorNameEdit} </span>
                )}

                <input
                  value={idPosition}
                  onChange={(e) => setIdPosition(e.target.value)}
                  type="hidden"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-tutup-update"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="btn btn-primary"
                >
                  Update
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
