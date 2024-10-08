import React from "react";
import { Modal } from "react-bootstrap";
import "./navstlye.scss";

const GenericModal = ({
  show,
  onHide,
  title,
  body,
  subtitle,
  child,
  subtitletext,
}) => {
  return (
    <div>
      <Modal
        style={{
          width: "400px",
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        show={show}
        onHide={onHide}
      >
        <Modal.Header className="modal-header d-flex align-items-center justify-content-center border-0  ">
          <div>
            <h4
              className="modal-title"
              style={{
                color: "#A3238E",
                fontWeight: "bold",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              <Modal.Title>{title}</Modal.Title>
            </h4>
            <div className="subtitle card-text">
              <span
                style={{
                  color: "#F38B3A",
                  fontSize: "14px",
                }}
              >
                {subtitle}
              </span>{" "}
              : {subtitletext}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          style={{ overflow: "auto", maxHeight: "250px" }}
          className="border-0 gap-element"
        >
          {body}
        </Modal.Body>
        <Modal.Footer className="border-0 gap-element">{child}</Modal.Footer>
      </Modal>
    </div>
  );
};

export default GenericModal;
