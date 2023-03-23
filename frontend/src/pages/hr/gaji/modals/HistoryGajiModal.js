import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";

const HistoryGajiModal = ({
  idPayrollHistory,
  getDetailPayroll,
  numberFormat,
}) => {
  const [dataHistroy, setDataHistory] = useState();
  useQuery(["dataPayrollHistory", idPayrollHistory], getDetailPayroll, {
    onSuccess: (data) => {
      if (data.data !== null) {
        setDataHistory(data.data);
        console.log(data.data);
      }
    },
  });
  return (
    <div>
      <div
        className="modal fade"
        id="modal-detail"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {dataHistroy && (
                  <p>Salary Detail {dataHistroy.payrolls.employees.name}</p>
                )}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {dataHistroy && (
                <>
                  <div className="mb-2">
                    <label className="form-label">Periode </label>
                    <label className="form-label ms-2">
                      {moment(dataHistroy.periode).format("MM - YYYY")}
                    </label>
                  </div>
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Income</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>- basic salary</td>
                        <td align="right">
                          {numberFormat(dataHistroy.payrolls.basic_salary)}
                        </td>
                      </tr>
                      <tr>
                        <td>- transport allowance</td>
                        <td align="right">
                          {numberFormat(
                            dataHistroy.payrolls.transportation_allowance
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>- positional allowance</td>
                        <td align="right">
                          {numberFormat(
                            dataHistroy.payrolls.positional_allowance
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Overtime</td>
                      </tr>
                      <tr>
                        <td>- weight 1</td>
                        <td align="right">
                          {numberFormat(dataHistroy.weight_ot1)}
                        </td>
                      </tr>
                      <tr>
                        <td>- weight 2</td>
                        <td align="right">
                          {numberFormat(dataHistroy.weight_ot2)}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Income</th>
                        <td align="right">
                          {numberFormat(dataHistroy.bruto_salary)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Expenditure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>- absent</td>
                        <td align="right">
                          {numberFormat(dataHistroy.absent)}
                        </td>
                      </tr>
                      <tr>
                        <td>- health bpjs</td>
                        <td align="right">
                          {numberFormat(dataHistroy.payrolls.health_bpjs)}
                        </td>
                      </tr>
                      <tr>
                        <td>- employment bpjs</td>
                        <td align="right">
                          {numberFormat(dataHistroy.payrolls.employment_bpjs)}
                        </td>
                      </tr>
                      <tr>
                        <td>- debt</td>
                        <td align="right">{numberFormat(0)}</td>
                      </tr>
                      <tr>
                        <th>Total Expenditure</th>
                        <td align="right">
                          {numberFormat(dataHistroy.total_deduction)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>- net salary</td>
                        <td align="right">
                          {numberFormat(dataHistroy.nett_salary)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-tutup-generate"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button
                type="button"
                onClick={() => handleSave()}
                className="btn btn-primary"
              >
                Generate
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryGajiModal;
