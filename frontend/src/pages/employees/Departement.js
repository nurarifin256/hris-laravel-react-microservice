import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postDepartmentToAPI } from "../../config/redux/action";

const Departement = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [department, setDepartment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [name, setName] = useState("");
  const [positionData, setPositionData] = useState("");
  const [id_position, setIdPosition] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPosition, setErrorPosition] = useState("");

  useEffect(() => {
    fetchDepartment();
  }, [currentPage, sort, filter]);

  const fetchDepartment = () => {
    axios
      .get(
        `http://localhost:8000/api/get-department?page=${currentPage}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        setDepartment(response.data.data);
        setPositionData(response.data.dataPositions);
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
      name: "Name Department",
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Name Position",
      selector: (row, i) => row.positions.name,
      sortable: true,
    },
  ];

  async function handleSave() {
    let created_by = user.user.name;
    let data = { name, id_position, created_by };
    let result = postDepartmentToAPI(data);
    result = await result;
    if (
      result["name"] == "Name is required" ||
      result["id_position"] == "Position is required"
    ) {
      setErrorName(result["name"]);
      setErrorPosition(result["id_position"]);
    } else {
      const btnClose = document.querySelector(".btn-tutup");
      btnClose.click();
      fetchDepartment();
      toast.success("Save data department success", {
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
            data={department}
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
                    Name Departement
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className={`form-control ${
                      errorName ? "is-invalid" : null
                    }`}
                    id="name"
                    placeholder="Enter name"
                  />
                  {errorName && (
                    <span className="text-danger"> {errorName} </span>
                  )}
                </div>
                <div className="mb-3 mt-2">
                  <label className="form-label">Position</label>
                  <select
                    className={`form-select ${
                      errorPosition ? "is-invalid" : null
                    }`}
                    aria-label="Default select example"
                    value={id_position}
                    onChange={(e) => setIdPosition(e.target.value)}
                  >
                    <option value={null}>Choose Position</option>
                    {positionData && positionData.length > 0
                      ? positionData.map((pos, i) => {
                          return (
                            <option key={i} value={pos.id}>
                              {pos.name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                  {errorPosition && (
                    <span className="text-danger"> {errorPosition} </span>
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

export default Departement;
