import React from "react";
import { Modal } from "react-bootstrap";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = (props) => {
  return (
    <>
      <Modal show={props?.status} backdrop="static" size="sm" centered>
        <Modal.Body className="m-3">
          <div className="text-center">
            <ScaleLoader color="#a3238e" loading={props.status} size={50} />
            <h6>Fetching Data...</h6>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Loader;
