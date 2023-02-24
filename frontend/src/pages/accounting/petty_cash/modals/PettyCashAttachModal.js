import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

const PettyCashAttachModal = ({
  number,
  getAttachment,
  deleteAttach,
  refetch,
  addPettyAttach,
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesUploadE, setImagesUploadE] = useState([]);

  const { data } = useQuery(["attachment", number], getAttachment);
  const { mutate: hapusBackendAttach } = useMutation(
    (dataAttach) => deleteAttach(dataAttach),
    {
      onSuccess(datas) {
        let result = datas;
        if (result["message"] == "Delete attachment success") {
          refetch();
          toast.success(result["message"], {
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

  const handleDeleteAttach = (id, file_attach) => {
    const dataAttach = { id, file_attach };
    const btnClose = document.querySelector(".btn-tutup-attach");
    btnClose.click();
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => hapusBackendAttach(dataAttach),
        },
        {
          label: "No",
          //   onClick: () => hapusBackendAttach(id),
        },
      ],
    });
  };

  const handleImageChangeE = (event) => {
    const selectedFIles = [];
    const targetFiles = event.target.files;
    const targetFilesObject = [...targetFiles];
    targetFilesObject.map((file) => {
      return selectedFIles.push(URL.createObjectURL(file));
    });
    setImagePreviews(selectedFIles);
    setImagesUploadE(targetFiles);
  };

  const { mutate: addAttachlPetty } = useMutation(
    (formData) => addPettyAttach(formData),
    {
      onSuccess: (dataAtt) => {
        let result = dataAtt;
        if (result["message"] == "Add attachment petty cash success") {
          refetch();
          const btnClose = document.querySelector(".btn-tutup-attach");
          btnClose.click();
          toast.success(result["message"], {
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

  const handleAddAttach = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("number", number);

    for (let i = 0; i < imagesUploadE.length; i++) {
      formData.append(`attachPetty[${i}]`, imagesUploadE[i]);
    }
    addAttachlPetty(formData);
  };

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
                  </a>
                  {data.data.length > 1 ? (
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      type="button"
                      onClick={() => handleDeleteAttach(d.id, d.file_attach)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  ) : null}
                </div>
              );
            })}

            <div className="mt-3">
              <label htmlFor="gambar" className="form-label">
                Attachment
              </label>

              <div>
                {imagePreviews.map((url, i) => {
                  return (
                    <div key={i} className="row-collumn">
                      <div className="collumn">
                        <img className="gambar" src={url} alt="Preview" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <input
                className="form-control"
                type="file"
                multiple
                id="formFile"
                onChange={(e) => handleImageChangeE(e)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-tutup-attach"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              onClick={(e) => handleAddAttach(e)}
              className="btn btn-primary"
            >
              Add Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PettyCashAttachModal;
