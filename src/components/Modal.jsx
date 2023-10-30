import { bool, func, string } from "prop-types";
import { useEffect, useRef } from "react";
import { FcApproval, FcHighPriority } from "react-icons/fc";

function Modal(props) {
  const { isOpen, handleClose, title, text } = props;
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    isOpen ? modalRef.current.showModal() : modalRef.current.close();
  }, [isOpen]);

  const handleModalClose = () => {
    if (handleClose) {
      handleClose();
    }
  };

  const handleESC = (event) => {
    event.preventDefault();
    handleModalClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === modalRef.current) {
      handleModalClose();
    }
  };

  return (
    <dialog
      ref={modalRef}
      className={`modal`}
      onCancel={handleESC}
      onClick={handleOverlayClick}
    >
      <div className="modal-box">
        <h3 className="pb-4 text-center text-2xl font-bold">{title}</h3>
        <div className="flex items-center justify-center">
          {title === "Error" ? (
            <div className="h-20 w-20">
              <FcHighPriority className="h-20 w-20"></FcHighPriority>
            </div>
          ) : (
            <div className="h-20 w-20">
              <FcApproval className="h-20 w-20"></FcApproval>
            </div>
          )}
        </div>
        <p className="pt-4 text-center">{text}</p>
        <div className="modal-action justify-center">
          <button className="btn btn-primary" onClick={handleModalClose}>
            Tutup
          </button>
        </div>
      </div>
    </dialog>
  );
}

Modal.propTypes = {
  isOpen: bool,
  handleClose: func,
  title: string,
  text: string,
};

export default Modal;
