import { bool, func, string } from "prop-types";
import { useEffect, useRef } from "react";
import { FcApproval, FcDisapprove, FcHighPriority } from "react-icons/fc";

// https://stackoverflow.com/questions/76955824/how-to-control-daisyui-modal-after-update-to-v3-in-reactjs
function ModalProductDelete(props) {
    const { isOpen, handleClose, title, text, handleConfirmDelete } = props;
    const modalRef = useRef(null);

    // tunggu sampai komponen ada
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

    const handleConfirm = () => {
        if (handleConfirmDelete) {
            handleConfirmDelete();
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
                            <FcHighPriority className="h-20 w-20"></FcHighPriority>
                        </div>
                    )}
                </div>
                <p className="pt-4 text-center">{text}</p>
                <div className="modal-action justify-center">
                    <button className="btn btn-error" onClick={handleConfirm}>
                        Ya
                    </button>
                    <button className="btn btn-primary" onClick={handleModalClose}>
                        Tidak
                    </button>
                </div>
            </div>
        </dialog>
    );
}

ModalProductDelete.propTypes = {
    isOpen: bool,
    handleClose: func,
    handleConfirm: func,
    title: string,
    text: string,
};

export default ModalProductDelete;
