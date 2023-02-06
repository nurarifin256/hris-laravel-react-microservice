import React from "react";
import { usePositionData } from "../../config/hooks/employee/positionHook";
import { useMutation } from "react-query";

const RQPosition = () => {
  // const fortmatResponse = (res) => {
  //   return JSON.stringify(res, null, 2);
  // };

  const { data: positions } = usePositionData();

  const getPosition = async (id: string) => {
    let data = { id };
    let response = await fetch("http://localhost:8000/api/edit-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    response = await response.json();
    return response;
  };

  const {
    mutate: editPosition,
    data,
    isSuccess,
  } = useMutation((id: string) => getPosition(id), {
    // onSuccess(data) {},
    onError(error: any) {},
  });

  // if (isSuccess) {
  //   console.log(data);
  // }

  // const editPosition = (id: string) => {
  //   getData(id);
  // };

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {positions?.data.data.map((position, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{position.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => editPosition(position.id)}
                        >
                          Get by Id
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RQPosition;
