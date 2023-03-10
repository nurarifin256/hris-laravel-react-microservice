import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  getAttachment,
  deleteAttach,
  addPettyAttach,
  getPettyDetail,
  postPettyDetail,
  deletePettyDetail,
  editPettyDetail,
  updatePettyDetail,
} from "../../../config/hooks/accounting/pettCashDetailHook";
import DataTable from "react-data-table-component";
import moment from "moment";
import PettyCashPostModal from "./modals/PettyCashPostModal";
import PettyCashAttachModal from "./modals/PettyCashAttachModal";
import { confirmAlert } from "react-confirm-alert";
import PettyCashEditModal from "./modals/PettyCashEditModal";

const PettyCash = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const { number } = useParams();
  const [pettyCash, setPettyCash] = useState([]);
  const [coa, setCoa] = useState([]);
  const [department, setDepartment] = useState([]);
  const [numberJpd, setNumberJpd] = useState("");

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

  let ballance = pettyCash;
  let lastBallance = ballance[ballance.length - 1];
  let firstBallance = ballance[0];

  const { mutate: deleteBackend } = useMutation(
    (dataDelete) => deletePettyDetail(dataDelete),
    {
      onSuccess(data) {
        let result = data;
        if (result["message"] == "Delete petty cash success") {
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
    }
  );

  const handleDelete = (numberJournal, numberRefill) => {
    let updated_by = user.user.name;
    let balanceL = firstBallance.balance;
    let dataDelete = { numberJournal, updated_by, balanceL, numberRefill };
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteBackend(dataDelete),
        },
        {
          label: "No",
        },
      ],
    });
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
      width: "300px",
    },
    {
      name: "Attachment",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row, i) =>
        row.number_journal !== "-" ? (
          <button
            className="btn badge text-bg-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#modal-attach"
            onClick={() => setNumberJpd(row.number_journal)}
          >
            View
          </button>
        ) : (
          "No File"
        ),
      sortable: true,
    },
    {
      name: "Debit",
      // selector: (row, i) => numberFormat(row.debit),
      width: "150px",
      sortable: true,
      cell: (row) => (
        <div style={{ textAlign: "end" }}>{numberFormat(row.debit)}</div>
      ),
    },
    {
      name: "Credit",
      selector: (row, i) => numberFormat(row.credit),
      sortable: true,
      width: "150px",
    },
    {
      name: "Balance",
      selector: (row, i) =>
        row.debit < 1.0 || i === 0 ? numberFormat(row.balance) : "",
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
            onClick={() => handleDelete(row.number_journal, row.number_refill)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            onClick={() => setNumberJpd(row.number_journal)}
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

      {/* modal attachment */}
      <PettyCashAttachModal
        number={numberJpd}
        getAttachment={getAttachment}
        deleteAttach={deleteAttach}
        refetch={refetch}
        addPettyAttach={addPettyAttach}
      />

      {/* modal add */}
      <PettyCashPostModal
        coas={coa}
        department={department}
        refetch={refetch}
        postPettyDetail={postPettyDetail}
        number={number}
        lastBallance={lastBallance}
        user={user}
      />

      {/* modal edit */}
      {firstBallance && (
        <PettyCashEditModal
          number={number}
          numberJpd={numberJpd}
          coas={coa}
          department={department}
          refetch={refetch}
          editPettyDetail={editPettyDetail}
          lastBallance={lastBallance}
          user={user}
          updatePettyDetail={updatePettyDetail}
          firstBallance={firstBallance.balance}
        />
      )}
    </div>
  );
};

export default PettyCash;
