import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import LocationModal from "../modals/LocationModal";

const HistoryAttendanceDT = ({ idEmployee, getAttendace, MyMap }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [historyAttendance, setHistoryAttendance] = useState([]);
  const [latitudeM, setLatitudeM] = useState(null);
  const [longitudeM, setLongitudeM] = useState(null);
  const [image, setImage] = useState(null);

  const { refetch } = useQuery(
    ["absenceHistory", currentPage, filter, perPage, idEmployee],
    getAttendace,
    {
      onSuccess: (data) => {
        setHistoryAttendance(data.data);
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
      name: "Date",
      selector: (row, i) => moment(row.created_at).format("DD/MM/YYYY hh:mm"),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row, i) => (row.type === 1 ? "IN" : "OUT"),
      sortable: true,
    },
    {
      name: "Location & Photo",
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row, i) => (
        <button
          className="btn badge text-bg-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#modal-location"
          onClick={() => {
            setLatitudeM(row.latitude);
            setLongitudeM(row.longitude);
            setImage(row.photo);
          }}
        >
          View
        </button>
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
            // onClick={() => handleHapus(row.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className="btn btn-warning btn-sm ms-2"
            // onClick={() => {
            //   setShowModal(true);
            //   setIdEdit(row.id);
            // }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row my-5">
        <div className="col-md-3">
          <h3>Absence History</h3>
        </div>
        <div className="col-md-3 offset-md-6">
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
              data={historyAttendance}
              columns={columns}
              pagination
              paginationServer
              paginationTotalRows={totalPages * perPage}
              onChangePage={handlePageChange}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>

      {/* modal location */}
      <LocationModal
        latitudeM={latitudeM}
        longitudeM={longitudeM}
        MyMap={MyMap}
        image={image}
      />
    </>
  );
};

export default HistoryAttendanceDT;
