import { useState } from "react";
import { useQuery, useMutation } from "react-query";

const GenerateGajiModal = ({ id, generatePayroll, numberFormat }) => {
  const [dataPayroll, setDataPayroll] = useState([null]);
  const [dataOt, setDataOt] = useState([null]);
  const [dataSettle, setDataSettle] = useState([null]);

  useQuery(["dataPayroll", id], generatePayroll, {
    onSuccess: (data) => {
      if (data.message !== "empty") {
        setDataPayroll(data.data.data_payroll);
        setDataOt(data.data.data_lembur);
        setDataSettle(data.data.data_payroll_settle);
      }
    },
  });

  return (
    <div>
      <div
        className="modal fade"
        id="modal-generate"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Generate Payroll{" "}
                {dataPayroll[0] !== null ? dataPayroll.employees.name : null}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {dataPayroll[0] !== null && (
                <>
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
                          {numberFormat(dataPayroll.basic_salary)}
                        </td>
                      </tr>
                      <tr>
                        <td>- transport allowance</td>
                        <td align="right">
                          {numberFormat(dataPayroll.transportation_allowance)}
                        </td>
                      </tr>
                      <tr>
                        <td>- positional allowance</td>
                        <td align="right">
                          {numberFormat(dataPayroll.positional_allowance)}
                        </td>
                      </tr>
                      <tr>
                        <td>Overtime</td>
                      </tr>
                      <tr>
                        <td>- weight 1</td>
                        <td align="right">{numberFormat(dataOt.value1)}</td>
                      </tr>
                      <tr>
                        <td>- weight 2</td>
                        <td align="right">{numberFormat(dataOt.value2)}</td>
                      </tr>
                      <tr>
                        <th>Total Income</th>
                        <td align="right">
                          {numberFormat(dataSettle.bruto_sallary)}
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
                        <td>Absent</td>
                        <td align="right">
                          {numberFormat(dataSettle.potongan_absen)}
                        </td>
                      </tr>
                      <tr>
                        <td>Debt</td>
                        <td align="right">{numberFormat(0)}</td>
                      </tr>
                      <tr>
                        <th>Total Expenditure</th>
                        <td align="right">
                          {numberFormat(dataSettle.potongan_absen)}
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
                        <td>Net Salary</td>
                        <td align="right">
                          {numberFormat(dataSettle.net_sallary)}
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
                className="btn btn-secondary btn-tutup"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                // onClick={() => handleSave()}
                className="btn btn-primary"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateGajiModal;
