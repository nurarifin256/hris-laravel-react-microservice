import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const PettyCashAttachModal = ({ number, getAttachment }) => {
  const { data } = useQuery(["attachment", number], getAttachment);

  return (
    <div
      className="modal fade"
      id="modal-attach"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Attachment Journal Number {number}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {data?.data.map((d, i) => {
              return (
                <div key={i} className="mt-2">
                  <a
                    href={`http://127.0.0.1:8000/api/${d.file_attach}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Attachment {i + 1}</span>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      type="button"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-tutup-edit"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PettyCashAttachModal;
