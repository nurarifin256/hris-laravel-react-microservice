import { confirmAlert } from "react-confirm-alert";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const CoaDeleteModal = ({ id, deleteCoaData, refetch }) => {
  const { mutate: hapusBackend } = useMutation((id) => deleteCoaData(id), {
    onSuccess(data) {
      if (data.message == "Delete data coa success") {
        refetch();
        toast.success("Delete data coa success", {
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
  });

  // const handleHapus = (id) => {
  //     confirmAlert({
  //       title: "Confirm to submit",
  //       message: "Are you sure to do this.",
  //       buttons: [
  //         {
  //           label: "Yes",
  //           onClick: () => hapusBackend(id),
  //         },
  //         {
  //           label: "No",
  //           // onClick: () => onClose(),
  //         },
  //       ],
  //     });
  //   };
  return confirmAlert({
    title: "Confirm to submit",
    message: "Are you sure to do this.",
    buttons: [
      {
        label: "Yes",
        onClick: () => hapusBackend(id),
      },
      {
        label: "No",
        // onClick: () => onClose(),
      },
    ],
  });
};

export default CoaDeleteModal;
