import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import LocationModal from "../modals/LocationModal";

const HistoryAttendanceDT = ({
  idEmployee,
  getAttendace,
  MyMap,
  handleAbsentOut,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [historyAttendance, setHistoryAttendance] = useState([]);
  const [latitudeM, setLatitudeM] = useState(null);
  const [longitudeM, setLongitudeM] = useState(null);
  const [image, setImage] = useState(null);

  useQuery(
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
      width: "80px",
    },
    {
      name: "Date",
      selector: (row, i) => moment(row.created_at).format("DD-MM-YYYY"),
      sortable: true,
      width: "120px",
    },
    {
      name: "Type",
      selector: (row, i) => (row.type === 1 ? "Intra" : "Over Time"),
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row, i) => row.employees.name,
      sortable: true,
      width: "250px",
    },
    {
      name: "Time In",
      sortable: true,
      selector: (row, i) => moment(row.time_in).format("HH:MM"),
      width: "120px",
    },
    {
      name: "Time Out",
      sortable: true,
      width: "140px",
      selector: (row, i) =>
        row.time_out ? (
          moment(row.time_out).format("HH:MM")
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleAbsentOut(row.id)}
          >
            <i className="fa-solid fa-camera"></i> Absent Out
          </button>
        ),
    },
    {
      name: "Location & Photo",
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "180px",
      cell: (row, i) => (
        <button
          className="btn btn-sm btn-info"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#modal-location"
          onClick={() => {
            setLatitudeM(row.latitude);
            setLongitudeM(row.longitude);
            setImage(row.photo);
          }}
        >
          <i className="fa-solid fa-eye"></i> View
        </button>
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
