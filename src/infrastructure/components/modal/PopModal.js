import React from "react";
import { Modal } from "react-bootstrap";
import { MdCancel } from "react-icons/md";

const PopModal = ({ show, onHide, children }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Body
        style={{
          border: "1px solid #a3238e",

          textAlign: "center",
        }}
      >
        <MdCancel
          className="closeButton float-end"
          size={30}
          onClick={onHide}
        />
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default PopModal;
