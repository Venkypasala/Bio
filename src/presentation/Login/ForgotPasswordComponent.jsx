import React, { useEffect, useState } from "react";
import LoginImg from "../../infrastructure/assets/images/login_design.jpeg";
import LoginLogo from "../../infrastructure/assets/images/login-logo.jpg";
import { Link } from "react-router-dom";
import { forgotPassword, logIn } from "../../application/services/actions/auth";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgotPasswordComponent = (props) => {
  let validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email Required"),
    newpassword: Yup.string().required(" New Password Required"),
    renewpassword: Yup.string().required("Retype New Password Required"),
  });
  const navigate = useNavigate();
  const [showUpdateConfirm, setshowUpdateConfirm] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordReType, setPasswordReType] = useState("password");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const toggleRePassword = () => {
    if (passwordReType === "password") {
        setPasswordReType("text");
      return;
    }
    setPasswordReType("password");
  };
  const formHandler = async () => {
    let payload = {
      username: values.email,
      newPassword: values.newpassword,
      reNewPassword: values.renewpassword,
    };
  

    props
      .forgotPassword(payload)
      .then((res) => {
        setshowUpdateConfirm(true);
      })
      .catch((error) => {
        toast.error(error?.reason || "New password not updated", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      });
  };

  const { values, handleChange, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: "",
      newpassword: "",
      renewpassword:"",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      formHandler();
    },
  });

  return (
    <Container fluid className="main-login" sm={12} md={12} lg={12}>
      <Row className="login">
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "black" }} />
        <Col sm={10} md={10} lg={4} style={{ backgroundColor: "black" }}>
          <Row>
            <Col className="login-container">
              <Row
                sm={0}
                md={0}
                lg={6}
                className="d-flex justify-content-center align-items-center"
              >
                <Col
                  xs={2}
                  md={2}
                  lg={5}
                  style={{ float: "right", marginRight: "-1.5rem" }}
                >
                  <img
                    className="bio-logo me-2"
                    src={LoginLogo}
                    onClick={() => {
                      navigate("/");
                    }}
                  />
                </Col>
                <Col xs={10} md={10} lg={7}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "#a3238e",
                      float: "left",
                      marginRight: "4rem",
                    }}
                  >
                    BioOrganics
                  </span>
                </Col>
              </Row>
              <div
                style={{
                  //borderTop: "2px solid #fff ",
                  marginLeft: 15,
                  marginRight: 15,
                }}
              ></div>
              <hr />
              <Modal
            show={showUpdateConfirm}
            //onHide={handleClose}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  // padding: "1rem",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                Successfull!
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                New Password Updated!!
              </p>
              {/* <div><h6></h6></div> */}
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    //top: "8rem",
                    //left: "10rem",
                    marginLeft: "2rem",
                    alignItems: "center",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => {setshowUpdateConfirm(false),
                navigate("/login")}}
                >
                  Close
                </button>
              </div>
            </Modal.Body>
          </Modal>
              <Row>
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      id="email"
                      name="email"
                      className="justify-content-end"
                      placeholder="Email Address"
                      style={{
                        width: "60%",
                        height: "3rem",
                        borderRadius: "5px",
                        border: "1px solid rgb(209 209 209)",
                        padding:"8px"
                      }}
                      onChange={handleChange("email")}
                    />
                    {touched.email && errors.email ? (
                      <div style={{ color: "red" }}>{errors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      id="newpassword"
                      name="newpassword"
                      type={passwordType}
                      className="justify-content-end"
                      placeholder="Enter new password"
                      style={{
                        width: "60%",
                        height: "3rem",
                        borderRadius: "5px",
                        border: "1px solid rgb(209 209 209)",
                        marginTop: "10px",
                        padding:"8px"
                      }}
                      onChange={handleChange("newpassword")}
                    />
                    {passwordType === "password" ? (
                        <AiOutlineEye
                          className="input-group-btn"
                          size={20}
                          onClick={togglePassword}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          className="input-group-btn"
                          size={20}
                          onClick={togglePassword}
                        />
                      )}
                    {touched.newpassword && errors.newpassword ? (
                      <div style={{ color: "red" }}>{errors.newpassword}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      id="renewpassword"
                      name="renewpassword"
                      type={passwordReType}
                      className="justify-content-end"
                      placeholder="Re-enter new password"
                      style={{
                        width: "60%",
                        height: "3rem",
                        borderRadius: "5px",
                        border: "1px solid rgb(209 209 209)",
                        marginTop: "10px",
                        padding:"8px"
                      }}
                      onChange={handleChange("renewpassword")}
                    />
                    {passwordReType === "password" ? (
                        <AiOutlineEye
                          className="input-group-btn"
                          size={20}
                          onClick={toggleRePassword}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          className="input-group-btn"
                          size={20}
                          onClick={toggleRePassword}
                        />
                      )}
                    {touched.renewpassword && errors.renewpassword ? (
                      <div style={{ color: "red" }}>{errors.renewpassword}</div>
                    ) : null}
                  </div>
                </form>
              </Row>
              <Row>
                <Col>
                  <button
                    className="login-submit-btn"
                    onClick={() => {
                      // formHandler();
                      handleSubmit();
                    }}
                  >
                    Change Password
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={12} lg={7}>
          <img className="background-img" src={LoginImg} />
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = ({ authReducer: { logIn } }) => ({
  logIn,
});
const mapDispatchToProps = {
  forgotPassword: (payloadData) => forgotPassword(payloadData),
};
export default connect(mapStateToProps,mapDispatchToProps)(ForgotPasswordComponent);
