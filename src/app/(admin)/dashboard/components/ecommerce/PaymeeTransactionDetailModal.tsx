import React from "react";

interface Props {
  transaction: any;
  onClose: () => void;
}

const PaymeeTransactionDetailModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;
  return (
    <div className="paymee-modal-overlay">
      <div className="paymee-modal-content">
        <h2 className="paymee-modal-title">Transaction Details</h2>
        <table className="paymee-modal-table">
          <tbody>
            {Object.entries(transaction).map(([key, value]) => (
              <tr key={key}>
                <td className="font-semibold pr-4 py-1">{key}</td>
                <td className="py-1">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="paymee-modal-close-btn"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymeeTransactionDetailModal;