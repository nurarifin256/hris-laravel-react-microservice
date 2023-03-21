import { useState } from "react";
import { useQuery, useMutation } from "react-query";

const GenerateGajiModal = ({
  id,
  generatePayroll,
  numberFormat,
  postGeneratePayroll,
  toast,
}) => {
  const [dataPayroll, setDataPayroll] = useState([null]);
  const [dataOt, setDataOt] = useState([null]);
  const [dataSettle, setDataSettle] = useState([null]);
  const [periode, setPeriode] = useState(null);

  useQuery(["dataPayroll", id], generatePayroll, {
    onSuccess: (data) => {
      if (data.message !== "empty") {
        setDataPayroll(data.data.data_payroll);
        setDataOt(data.data.data_lembur);
        setDataSettle(data.data.data_payroll_settle);
      }
    },
  });

  const { mutate: addGenerate } = useMutation(
    (dataGenerate) => postGeneratePayroll(dataGenerate),
    {
      onSuccess: (data) => {
        if (data.message === "Generate payroll success") {
          const btnClose = document.querySelector(".btn-tutup-generate");
          btnClose.click();
          toast.success(data.message, {
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

  const handleSave = () => {
    let idPayroll = id;
    let dataGenerate = { ...dataOt, idPayroll, periode, dataSettle };
    addGenerate(dataGenerate);
  };

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
                        <td>- absent</td>
                        <td align="right">
                          {numberFormat(dataSettle.potongan_absen)}
                        </td>
                      </tr>
                      <tr>
                        <td>- health bpjs</td>
                        <td align="right">
                          {numberFormat(dataPayroll.health_bpjs)}
                        </td>
                      </tr>
                      <tr>
                        <td>- employment bpjs</td>
                        <td align="right">
                          {numberFormat(dataPayroll.employment_bpjs)}
                        </td>
                      </tr>
                      <tr>
                        <td>- debt</td>
                        <td align="right">{numberFormat(0)}</td>
                      </tr>
                      <tr>
                        <th>Total Expenditure</th>
                        <td align="right">
                          {numberFormat(dataSettle.total_potongan)}
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
                          {numberFormat(dataSettle.net_sallary)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mb-3">
                    <label className="form-label">Periode</label>
                    <input
                      required
                      type="date"
                      className="form-control"
                      onChange={(e) => setPeriode(e.target.value)}
                    />
                  </div>
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
              <button
                type="button"
                onClick={() => handleSave()}
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
