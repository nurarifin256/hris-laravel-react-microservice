import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { postEmployee } from "../../config/redux/action";
import "./position.css";

const Employee = () => {
  const dispatch = useDispatch();
  const usersReducer = useSelector((state) => state.userReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(10);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");
  const [image, setImage] = useState("");
  const [imageF, setImageF] = useState("");
  const [imageC, setImageC] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewF, setPreviewF] = useState(null);
  const [previewC, setPreviewC] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [idDepartment, setIdDepartment] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorGender, setErrorGender] = useState("");
  const [errorNumber, setErrorNumber] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorAddress, seterrorAddress] = useState("");

  useEffect(() => {
    fetchEmployees();
    dispatch({ type: "GET_USER" });
  }, [currentPage, sort, filter]);

  const fetchEmployees = () => {
    axios
      .get(
        `http://localhost:8000/api/get-employees?page=${currentPage}&filter=${filter}&per_page=${perPage}`
      )
      .then((response) => {
        setEmployees(response.data.data);
        setDepartmentData(response.data.departmentData);
        setTotalPages(response.data.meta.last_page);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Name position",
      selector: (row, i) => row.departmens.positions.name,
      sortable: true,
    },
    {
      name: "Name department",
      selector: (row, i) => row.departmens.name,
      sortable: true,
    },
    {
      name: "Number phone",
      selector: (row, i) => row.mobile_phone_number,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row, i) => row.gender,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row, i) => row.address,
      sortable: true,
    },
    {
      name: "Identity Card",
      selector: (row, i) => row.identity_card,
      sortable: true,
    },
    {
      name: "Family Card",
      selector: (row, i) => row.family_card,
      sortable: true,
    },
    {
      name: "Certificate",
      selector: (row, i) => row.certificate,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, i) => (
        <div>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            //   onClick={() => handleHapus(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            //   onClick={() => handleEdit(row.id)}
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

  const optionGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const optionsDepartment = departmentData.map((item) => {
    return {
      label: item.positions.name + " - " + item.name,
      value: item.id,
    };
  });

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setImage(image);

    const previewUrl = URL.createObjectURL(image);
    setPreviewUrl(previewUrl);
  };

  const handleImageChangeF = (event) => {
    const imageF = event.target.files[0];
    setImageF(imageF);

    const previewF = URL.createObjectURL(imageF);
    setPreviewF(previewF);
  };

  const handleImageChangeC = (event) => {
    const imageC = event.target.files[0];
    setImageC(imageC);

    const previewC = URL.createObjectURL(imageC);
    setPreviewC(previewC);
  };

  async function handleSave() {
    let created_by = usersReducer.user.user.name;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("idDepartment", idDepartment);
    formData.append("number", number);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("image", image);
    formData.append("imageF", imageF);
    formData.append("imageC", imageC);
    formData.append("created_by", created_by);
    let result = postEmployee(formData);
    result = await result;
    console.warn(result);
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
            data={employees}
            pagination
            paginationServer
            paginationTotalRows={totalPages * perPage}
            onChangePage={handlePageChange}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* modal add */}
      <div
        className="modal fade"
        id="modal-add"
        role="dialog"
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
                  Name Employee
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

              <div className="mb-3 mt-2">
                <label className="form-label">Position - Department</label>
                <Select
                  placeholder="Choose Department"
                  className={errorDepartment ? "is-invalid" : null}
                  onChange={(e) => setIdDepartment(e.value)}
                  options={optionsDepartment}
                />
                {errorDepartment && (
                  <span className="text-danger"> {errorDepartment} </span>
                )}
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label">Gender</label>
                <Select
                  className={errorGender ? "is-invalid" : null}
                  onChange={(e) => setGender(e.value)}
                  placeholder="Choose Gender"
                  options={optionGender}
                />
                {errorGender && (
                  <span className="text-danger"> {errorGender} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="number" className="form-label">
                  Number Phone
                </label>
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  type="number"
                  className={`form-control ${
                    errorNumber ? "is-invalid" : null
                  }`}
                  id="name"
                  placeholder="Enter number phone"
                />
                {errorNumber && (
                  <span className="text-danger"> {errorNumber} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`form-control area-text ${
                    errorAddress ? "is-invalid" : null
                  }`}
                  placeholder="Enter address"
                  id="address"
                ></textarea>

                {errorAddress && (
                  <span className="text-danger"> {errorAddress} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Identity Card
                </label>
                <div>
                  {previewUrl && (
                    <img className="gambar" src={previewUrl} alt="Preview" />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    handleImageChange(e);
                    setImage(e.target.files[0]);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Family Card
                </label>
                <div>
                  {previewF && (
                    <img className="gambar" src={previewF} alt="Preview" />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    setImageF(e.target.files[0]);
                    handleImageChangeF(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Certifacte
                </label>
                <div>
                  {previewC && (
                    <img className="gambar" src={previewC} alt="Preview" />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    handleImageChangeC(e);
                    setImageC(e.target.files);
                  }}
                />
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
  );
};

export default Employee;
