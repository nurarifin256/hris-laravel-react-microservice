import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import MyMaps from "../../../../components/MyMaps";

const AttendanceDT = ({ getAttendances }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

  const [attendances, setAttendances] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD 00:00:00")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD 23:59:00")
  );

  const { refetch } = useQuery(
    ["attendances", currentPage, filter, perPage, startDate, endDate],
    getAttendances,
    {
      onSuccess: (data) => {
        setAttendances(data.data);
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
      name: "Name",
      selector: (row, i) => row.employees.name,
      sortable: true,
    },
    {
      name: "IN",
      selector: (row, i) => (row.type === 1 ? "IN" : "OUT"),
      sortable: true,
    },
    {
      name: "Time In",
      selector: (row, i) => moment(row.created_at).format("DD/MM/YYYY hh:mm"),
      sortable: true,
    },
    {
      name: "OUT",
      selector: (row, i) => (row.type === 1 ? "IN" : "OUT"),
      sortable: true,
    },
    {
      name: "Time Out",
      selector: (row, i) => moment(row.created_at).format("DD/MM/YYYY hh:mm"),
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

  const handleDate = () => {
    refetch();
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="text-center mb-3">
            <MyMaps koordinat={attendances} />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-1">
          <label htmlFor="" className="col-form-label">
            Start Date
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            onChange={(e) => setStartDate(e.target.value + " 00:00:00")}
          />
        </div>
        <div className="col-md-1">
          <label htmlFor="" className="col-form-label">
            End Date
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            onChange={(e) => setEndDate(e.target.value + " 23:59:00")}
          />
        </div>
        <div className="col-md-4">
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
              data={attendances}
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
    </>
  );
};

export default AttendanceDT;
