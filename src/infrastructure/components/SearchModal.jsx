import React from "react";

const Modal = ({ setShow, children }) => {
  return (
    <>
      {/* <div className="backdrop-close" onClick={() => setShow(false)} /> */}
      <div className="option-type-option">{children}</div>
    </>
  );
};
export default Modal;
