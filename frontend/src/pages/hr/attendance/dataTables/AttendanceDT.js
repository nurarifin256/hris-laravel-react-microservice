import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";

const AttendanceDT = ({ getAttendances }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(15);
  const [sort, setSort] = useState({ column: "", direction: "" });
  const [filter, setFilter] = useState("");

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
        console.log(data);
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

  const handleDate = () => {
    refetch();
  };

  return (
    <>
      <div className="row">
        <div className="col-md-1">
          <label htmlFor="" className="col-form-label">
            Start Date
          </label>
        </div>
        <div className="col-md-2">
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
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            onChange={(e) => setEndDate(e.target.value + " 23:59:00")}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-md"
            type="button"
            onClick={() => handleDate()}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Find
          </button>
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
              //   data={historyAttendance}
              //   columns={columns}
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
