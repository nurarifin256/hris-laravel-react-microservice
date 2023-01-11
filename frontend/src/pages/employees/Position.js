import React, { useEffect, useState } from "react";
import axios from "axios";

const Position = () => {
  const [position, setPosition] = useState([]);

  useEffect(() => {
    fetchPosition();
  }, []);

  const fetchPosition = async () => {
    await axios
      .get("http://localhost:8000/api/get-position")
      .then(({ data }) => {
        setPosition(data.data);
        console.warn(data.data);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {position.length > 0 &&
                position.map((row, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{row.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Position;
