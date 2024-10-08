import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { CiLocationArrow1 } from "react-icons/ci";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import PurpleCircle from "../../infrastructure/assets/images/purple_circle.png";
import HeaderComponent from "../../presentation/Header/HeaderComponent";
import { connect } from "react-redux";
import { postContactList } from "../../application/services/actions/auth";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { MdOutlineCancel } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
const ValidationSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .nullable()
    .required("Name is required."),
  email: yup.string().nullable().email().required("Email is required."),
  message: yup.string().nullable().required("Message is required."),
});
function ContactComponent(props) {
  const [show, setShow] = useState(false);
  const formHandler = async (value) => {
    const payload = {
      id: "",
      fullName: value.fullName,
      emailId: value.email,
      message: value.message,
    };

    await props
      .PostContact(payload)
      .then((res) => {
        toast.success("Query Sent Successfully!" || "Success", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        handleReset();
        setIsClicked(false);
        value.fullName = "";
        value.email = "";
        value.message = "";
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
  const {
    handleSubmit,
    handleReset,
    setFieldValue,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      message: "",
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    validationSchema: ValidationSchema,
    validateOnMount: true,
    validateOnChange: true,

    onSubmit: (values) => formHandler(values),
  });

  const [isClicked, setIsClicked] = useState(false);
  const handleClose = () => setShow(false);
  const handleClick = () => {
    setIsClicked(true);
    handleSubmit();
  };

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };
  const isFormValid =
    Object.keys(errors).length === 0 && Object.keys(touched).length !== 0;
  return (
    <Container fluid className="main-contact">
      <Row className="w-100">
        <Col
          className="navbar-section web-closer-setion text-end"
          xs={12}
          md={12}
          lg={12}
        >
          <HeaderComponent />
          <MdOutlineCancel
            type="button"
            className="modal-close-button"
            onClick={() => setShow((p) => !p)}
          />

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Are you sure?
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                You Want to leave the site?
              </p>
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    top: "8rem",
                    left: "2rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleCancelButton()}
                >
                  YES
                </button>
                <button
                  style={{
                    top: "8rem",
                    left: "11rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShow(false)}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>

      <Row className="containerDiv" style={{ backgroundColor: "#efefef" }}>
        <Col lg={6} md={12} className="text-center contact-div">
          <div className="imageDiv">
            <img className="purpleimg" src={PurpleCircle} />
          </div>
          {/* phone */}
          <div style={{ marginLeft: "-50px" }}>
            <p className="p1">
              <BsTelephone size={20} />
              <span style={{ marginLeft: "8% " }}>Phone</span>
            </p>
            <p
              className="text-white"
              style={{ marginTop: "-5px", paddingLeft: "15px" }}
            >
              080-2836 4617
            </p>
          </div>
          {/* email */}
          <div style={{ marginLeft: "-50px", marginTop: "3px" }}>
            <p className="p1">
              <CiMail size={20} />
              <span style={{ paddingLeft: "30px" }}>Email</span>
            </p>
            <p
              className="text-white"
              style={{ marginTop: "-5px", paddingLeft: "80px" }}
            >
              contact@bioorganics.biz
            </p>
          </div>
          {/* location */}
          <div style={{ marginLeft: "-20px", marginTop: "3px" }}>
            <p className="p1">
              <CiLocationArrow1 size={20} />
              <span style={{ marginLeft: "20px" }}>Location</span>
            </p>
            <p
              className="text-white"
              style={{
                marginTop: "-5px",
                paddingLeft: "130px",
                width: "400px",
                textAlign: "left",
              }}
            >
              B-64/1, III Stage, Peenya Industrial Area, Peenya, Bengaluru - 560
              058
            </p>
          </div>

          <section className="maps mt-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.268220586842!2d77.4967750743013!3d13.01858398730111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3cf61aaaaaab%3A0x5d9b8fc84da867a4!2sBioOrganics!5e0!3m2!1sen!2sin!4v1686657166371!5m2!1sen!2sin"
              width={"400"}
              height={"200rem"}
              style={{ borderRadius: "30px" }}
            ></iframe>
          </section>
        </Col>
        <Col md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
        <Col
          lg={4}
          md={12}
          className="text-center align-item-center justify-content-left "
        >
          <Row className="form-div" md={8} lg={10}>
            {/* <div className=""> */}
            <h1 className="form-text-div" style={{ color: "#434343" }}>
              We'd love to hear from you,
            </h1>
            <h1
              className=""
              style={{
                color: "#a3238e",
                fontSize: "27px",
                fontWeight: "bold",
                textAlign: "left",
                marginLeft: "14px",
              }}
            >
              Get in touch
            </h1>
          </Row>
          <Row className="form-div">
            <form
              className="justify-content-left"
              style={{ paddingLeft: "2rem" }}
            >
              <Col className="">
                <Row sm="12" md="12" lg="6">
                  <input
                    id="fullName"
                    name="fullName"
                    value={values.fullName}
                    className="form-style"
                    type="text"
                    placeholder="Full Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && touched.fullName ? (
                    <div className="errorMessage">{errors.fullName}</div>
                  ) : null}
                </Row>
                <Row>
                  <input
                    id="email"
                    name="email"
                    value={values.email}
                    className="form-style"
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email ? (
                    <div className="errorMessage">{errors.email}</div>
                  ) : null}
                </Row>
                <Row>
                  <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    className="form-style"
                    type="textarea"
                    rows="7"
                    placeholder="Message"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.message && touched.message ? (
                    <div className="errorMessage">{errors.message}</div>
                  ) : null}
                </Row>
                <Row style={{}}>
                  <Col></Col>
                  <Col xs="12" sm="12" md="4">
                    <button
                      type={"submit"}
                      disabled={!isFormValid || isClicked}
                      onClick={handleClick}
                      className={
                        !isFormValid || isClicked
                          ? "serviceform-submit-btn disabled"
                          : "serviceform-submit-btn"
                      }
                    >
                      Submit
                    </button>
                  </Col>
                </Row>
              </Col>
            </form>
          </Row>
        </Col>
      </Row>
    </Container>
    // </div>
  );
}

const mapDispatchToProps = {
  PostContact: (payload) => postContactList(payload),
};

export default connect(null, mapDispatchToProps)(ContactComponent);
