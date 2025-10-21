import React from "react";
import ReservationForm from "./ReservationForm";

interface ReservationModalProps {
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ onClose }) => {
  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h3>예약하기</h3>
        <ReservationForm />
      </div>
    </div>
  );
};

export default ReservationModal;
