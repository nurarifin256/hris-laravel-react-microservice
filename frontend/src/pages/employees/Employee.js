import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { deleteEmployee, postEmployee } from "../../config/redux/action";
import {
  getEmployeeData,
  updateEmployeeFN,
} from "../../config/hooks/employee/employeeHook";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
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

  const [id, setId] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [numberEdit, setNumberEdit] = useState("");
  const [genderEdit, setGenderEdit] = useState("");
  const [addressEdit, setAddressEdit] = useState("");
  const [idDepartmentEdit, setIdDepartmentEdit] = useState("");
  const [imageEdit, setImageEdit] = useState("");
  const [imageFEdit, setImageFEdit] = useState("");
  const [imageCEdit, setImageCEdit] = useState("");
  const [errorNameEdit, setErrorNameEdit] = useState("");
  const [errorGenderEdit, setErrorGenderEdit] = useState("");
  const [errorNumberEdit, setErrorNumberEdit] = useState("");
  const [errorDepartmentEdit, setErrorDepartmentEdit] = useState("");
  const [errorAddressEdit, seterrorAddressEdit] = useState("");

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
      cell: (row, i) => (
        <img
          src={"http://127.0.0.1:8000/api/" + row.identity_card}
          alt="My-Gambar"
          className="img-thumbnail"
        />
      ),
    },
    {
      name: "Family Card",
      cell: (row, i) => (
        <img
          src={"http://127.0.0.1:8000/api/" + row.family_card}
          alt="My-Gambar"
          className="img-thumbnail"
        />
      ),
    },
    {
      name: "Certificate",
      cell: (row, i) => (
        <img
          src={"http://127.0.0.1:8000/api/" + row.certificate}
          alt="My-Gambar"
          className="img-thumbnail"
        />
      ),
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
            onClick={() => handleEdit(row.id)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
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
    if (
      result["name"] == "Name is required" ||
      result["idDepartment"] == "Department is required" ||
      result["number"] == "Number is required" ||
      result["number"] == "Number phone min 12 digits and max 13 digits" ||
      result["gender"] == "Gender is required" ||
      result["address"] == "Address is required"
    ) {
      setErrorName(result["name"]);
      setErrorDepartment(result["idDepartment"]);
      setErrorNumber(result["number"]);
      setErrorGender(result["gender"]);
      seterrorAddress(result["address"]);
    } else {
      const btnClose = document.querySelector(".btn-tutup");
      btnClose.click();
      fetchEmployees();
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

  const handleHapus = (id) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this",
      buttons: [
        {
          label: "Yes",
          onClick: () => hapusBackend(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  async function hapusBackend(id) {
    let updated_by = usersReducer.user.user.name;
    let data = { id, updated_by };
    console.log(data);
    let result = deleteEmployee(data);
    result = await result;

    if (result["message"] == "Delete data employee success") {
      fetchEmployees();
      toast.success("Delete data employee success", {
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

  const { mutate: handleEdit } = useMutation((id) => getEmployeeData(id), {
    onSuccess(data) {
      const {
        id,
        name,
        id_department,
        gender,
        mobile_phone_number,
        identity_card,
        family_card,
        certificate,
        address,
      } = data.employee;
      setNameEdit(name);
      setIdDepartmentEdit(id_department);
      setGenderEdit(gender);
      setNumberEdit(mobile_phone_number);
      setAddressEdit(address);
      setImageEdit(identity_card);
      setImageFEdit(family_card);
      setImageCEdit(certificate);
      setId(id);
      const btnEdit = document.querySelector(".btn-edit");
      btnEdit.click();
    },
    onError(error) {},
  });

  const { mutate: updateEmployee } = useMutation(
    (formData) => updateEmployeeFN(formData),
    {
      onSuccess: (data) => {
        console.log(data);
        let result = data;
        if (
          result["nameEdit"] == "Name is required" ||
          result["idDepartmentEdit"] == "Department is required" ||
          result["numberEdit"] == "Number is required" ||
          result["numberEdit"] ==
            "Number phone min 12 digits and max 13 digits" ||
          result["genderEdit"] == "Gender is required" ||
          result["addressEdit"] == "Address is required"
        ) {
          setErrorNameEdit(result["nameEdit"]);
          setErrorDepartmentEdit(result["idDepartmentEdit"]);
          setErrorNumberEdit(result["numberEdit"]);
          setErrorGenderEdit(result["genderEdit"]);
          seterrorAddressEdit(result["addressEdit"]);
        } else {
          const btnClose = document.querySelector(".btn-tutup-edit");
          btnClose.click();
          fetchEmployees();
          toast.success("Update data employee success", {
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
      onError: (error) => {
        console.log(error);
      },
    }
  );

  async function handleUpdate(id) {
    let updated_by = usersReducer.user.user.name;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nameEdit", nameEdit);
    formData.append("idDepartmentEdit", idDepartmentEdit);
    formData.append("numberEdit", numberEdit);
    formData.append("genderEdit", genderEdit);
    formData.append("addressEdit", addressEdit);
    formData.append("imageEdit", imageEdit);
    formData.append("imageFEdit", imageFEdit);
    formData.append("imageCEdit", imageCEdit);
    formData.append("updated_by", updated_by);
    updateEmployee(formData);
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
            data={employees}
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
                  required
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
                  required
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
                    setImageC(e.target.files[0]);
                  }}
                  required
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

      {/* modal edit */}
      {/* {imageEdit && ( */}
      <div
        className="modal fade"
        id="modal-edit"
        role="dialog"
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
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name Employee
                </label>
                <input
                  value={nameEdit}
                  onChange={(e) => setNameEdit(e.target.value)}
                  type="text"
                  className={`form-control ${
                    errorNameEdit ? "is-invalid" : null
                  }`}
                  id="name"
                  placeholder="Enter name"
                />
                {errorNameEdit && (
                  <span className="text-danger"> {errorNameEdit} </span>
                )}
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label">Position - Department</label>
                <Select
                  options={optionsDepartment}
                  value={optionsDepartment.filter(function (option) {
                    return option.value === idDepartmentEdit;
                  })}
                  className={errorDepartmentEdit ? "is-invalid" : null}
                  onChange={(e) => setIdDepartmentEdit(e.value)}
                />
                {errorDepartmentEdit && (
                  <span className="text-danger"> {errorDepartmentEdit} </span>
                )}
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label">Gender</label>
                <Select
                  value={{ label: genderEdit, value: genderEdit }}
                  className={errorGenderEdit ? "is-invalid" : null}
                  onChange={(e) => setGenderEdit(e.value)}
                  options={optionGender}
                />
                {errorGenderEdit && (
                  <span className="text-danger"> {errorGenderEdit} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="number" className="form-label">
                  Number Phone
                </label>
                <input
                  value={numberEdit}
                  onChange={(e) => setNumberEdit(e.target.value)}
                  type="number"
                  className={`form-control ${
                    errorNumberEdit ? "is-invalid" : null
                  }`}
                  id="name"
                  placeholder="Enter number phone"
                />
                {errorNumberEdit && (
                  <span className="text-danger"> {errorNumberEdit} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  value={addressEdit}
                  onChange={(e) => setAddressEdit(e.target.value)}
                  className={`form-control area-text ${
                    errorAddressEdit ? "is-invalid" : null
                  }`}
                  placeholder="Enter address"
                  id="address"
                ></textarea>

                {errorAddressEdit && (
                  <span className="text-danger"> {errorAddressEdit} </span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Identity Card
                </label>
                <div>
                  {previewUrl ? (
                    <img className="gambar" src={previewUrl} alt="Preview" />
                  ) : (
                    <img
                      className="gambar"
                      src={"http://127.0.0.1:8000/api/" + imageEdit}
                      alt="Preview"
                    />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    handleImageChange(e);
                    setImageEdit(e.target.files[0]);
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Family Card
                </label>
                <div>
                  {previewF ? (
                    <img className="gambar" src={previewF} alt="Preview" />
                  ) : (
                    <img
                      className="gambar"
                      src={"http://127.0.0.1:8000/api/" + imageFEdit}
                      alt="Preview"
                    />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    setImageFEdit(e.target.files[0]);
                    handleImageChangeF(e);
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Certifacte
                </label>
                <div>
                  {previewC ? (
                    <img className="gambar" src={previewC} alt="Preview" />
                  ) : (
                    <img
                      className="gambar"
                      src={"http://127.0.0.1:8000/api/" + imageCEdit}
                      alt="Preview"
                    />
                  )}
                </div>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => {
                    handleImageChangeC(e);
                    setImageCEdit(e.target.files[0]);
                  }}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-tutup-edit"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleUpdate(id)}
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Employee;
