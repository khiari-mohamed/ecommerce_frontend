import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";

interface OrderModalProps {
  showDetails: boolean;
  showEdit: boolean;
  toggleModal: (open: boolean) => void;
  order: any;
}

const OrderModal: React.FC<OrderModalProps> = ({
  showDetails,
  showEdit,
  toggleModal,
  order,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleModal(false);
    };
    if (showDetails || showEdit) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDetails, showEdit, toggleModal]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        toggleModal(false);
      }
    };
    if (showDetails || showEdit) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDetails, showEdit, toggleModal]);

  if (!showDetails && !showEdit) {
    return null;
  }

  // Use portal to render modal outside table/tbody
  return ReactDOM.createPortal(
    <div className="dashboard-modal" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="dashboard-modal-content" ref={modalRef} style={{ position: "relative" }}>
        <button
          onClick={() => toggleModal(false)}
          className="dashboard-modal-close-btn"
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          &times;
        </button>
        {showDetails && <OrderDetails orderItem={order} />}
        {showEdit && <EditOrder order={order} toggleModal={toggleModal} />}
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
};

export default OrderModal;