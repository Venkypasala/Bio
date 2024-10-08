import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import SheImg from "../../infrastructure/assets/biolab/services.png";
import HeaderComponent from "../Header/HeaderComponent";
import FinalBarComponent from "../FinalBar/FinalBarComponent";
import AnalyticalIcon from "../../infrastructure/assets/icons/analytical service.svg";
import CustomIcon from "../../infrastructure/assets/icons/custom synthesis.svg";
import RDIcon from "../../infrastructure/assets/icons/rnd.svg";
import MoleculeIcon from "../../infrastructure/assets/icons/small molecule.svg";
import FTEIcon from "../../infrastructure/assets/icons/fte service.svg";
import ProcessIcon from "../../infrastructure/assets/icons/process-development.svg";
import { MdOutlineCancel } from "react-icons/md";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { postContactList } from "../../application/services/actions/auth";

const validationSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .nullable()
    .required("Name is required."),
  email: yup.string().nullable().email().required("Email is required."),
  message: yup.string().nullable().required("Message is required."),
});
const ServicesComponent = (props) => {
  const [show, setShow] = useState(false);
  const sidebar = [
    { type: "Custom Synthesis", img: CustomIcon },
    { type: "Analytical Services", img: AnalyticalIcon },
    { type: "Contract R & D", img: RDIcon },
    { type: "Small Molecule Manufacturing", img: MoleculeIcon },
    { type: "FTE Services", img: FTEIcon },
    { type: "Process Development", img: ProcessIcon },
  ];

  const content = [
    {
      type: "Custom Synthesis",
      data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    },
    {
      type: "Analytical Services",
      data: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    {
      type: "Contract R & D",
      data: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ",
    },
    {
      type: "Small Molecule Manufacturing",
      data: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ",
    },
    {
      type: "FTE Services",
      data: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ",
    },
    {
      type: "Process Development",
      data: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of ",
    },
  ];

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
    validationSchema: validationSchema,
    validateOnMount: true,
    validateOnChange: true,

    onSubmit: (values) => formHandler(values),
  });

  const [info, setInfo] = useState(content[0]);
  const [isClicked, setIsClicked] = useState(false);
  const [transparent, setTransparent] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setTransparent(false);
    } else {
      setTransparent(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleClose = () => setShow(false);
  const handleClick = () => {
    setIsClicked(true);
    handleSubmit();
  };
  const onClickHandler = (item) => {
    const temp = content.find((it) => it.type === item.type);
    setInfo(temp);
  };

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };
  const isFormValid =
    Object.keys(errors).length === 0 && Object.keys(touched).length !== 0;
  return (
    <Container fluid className="main-service">
      <Row className="w-100">
        <Col
          className="navbar-section  text-end"
          style={{
            backgroundColor: transparent ? "web-closer-setion" : "transparent",
            transition: "background-color 0.3s ease-in-out",
          }}
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
      {/* Best in class */}
      <Row>
        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#efefef",
            textAlign: "justify",
          }}
        ></Col>

        <Col sm={12} md={12} lg={10}>
          <Row
            style={{
              backgroundColor: "#efefef",
              paddingTop: "14rem",
            }}
          >
            <Col sm={12} md={12} lg={6}>
              <h1
                style={{
                  fontSize: "35px",
                  fontWeight: "bold",
                  paddingTop: "2rem",
                }}
              >
                Best in class
              </h1>
              <h2
                style={{
                  fontSize: "37px",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Customer Service
              </h2>
              <div className="py-3 d-block align-items-left">
                <p style={{ textAlign: "justify", fontSize: "16px" }}>
                  We offer a wide range of Services to meet the diverse needs of
                  our clients.Our services are tailored to meet the unique
                  requirements of each individual client and help them achieve
                  their goals.We strive to exceed expectations and build
                  long-term relationships with our clients.
                </p>
              </div>
            </Col>
            <Col sm={12} md={12} lg={6} className=" overflow-hidden">
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: "2rem",
                }}
              >
                <img className="corporatimage1" src={SheImg} />
              </div>
            </Col>
          </Row>
        </Col>

        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#efefef",
          }}
        ></Col>
      </Row>
      {/*  assist our clients */}
      <Row>
        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#f7f7f7",
          }}
        ></Col>
        <Col sm={12} md={12} lg={10}>
          <Row
            style={{
              backgroundColor: "#f7f7f7",
            }}
          >
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex align-items-center justify-content-center flex-row "
              style={{
                paddingTop: "2rem",
                textAlign: "justify",
              }}
            >
              <Col sm={0} md={0} lg={2}></Col>
              <Col
                sm={12}
                md={12}
                lg={8}
                className="d-flex align-items-center justify-content-center flex-column"
                style={{
                  paddingRight: "2rem",
                  paddingBottom: "3rem",
                }}
              >
                <h2
                  style={{
                    fontWeight: "bold",
                    color: "#a3238e",
                    paddingTop: "0.5rem",
                    marginBottom: "3rem",
                  }}
                >
                  We assist our clients in different ways.
                </h2>
                <div
                  style={{
                    minHeight: "40rem",
                    border: "3px solid #a3238e",
                    borderRadius: "25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      // width: "30%",
                      position: "relative",
                      left: "-6rem",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    {sidebar.map((item, index) => {
                      return (
                        <Row
                          key={index}
                          className="d-flex justify-content-center align-items-center"
                          onClick={() => onClickHandler(item)}
                          style={{
                            backgroundImage:
                              info.type === item.type
                                ? "linear-gradient(to left, #f6913a, #a3238e)"
                                : "",
                            padding: "3px 27px 3px 4px",
                            marginBottom: "10px",
                            cursor: "pointer",

                            marginLeft: info.type === item.type ? "-1rem" : 0,
                            marginRight: info.type === item.type ? "-1rem" : 0,
                            borderRadius: info.type === item.type ? "5px" : 0,
                          }}
                        >
                          <Col
                            md={4}
                            lg={4}
                            style={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              style={{
                                height:
                                  info.type === item.type ? "3.5rem" : "2.5rem",
                              }}
                              className="custom_icon_color"
                              src={item.img}
                            />
                          </Col>
                          <Col
                            md={8}
                            lg={8}
                            style={{
                              height: "100%",
                            }}
                          >
                            <h6
                              style={{
                                color:
                                  info.type === item.type ? "white" : "#a3238e",
                              }}
                            >
                              {item.type}
                            </h6>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      // width: "70%",
                      paddingRight: "4rem",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                      marginLeft: "-3rem",
                      marginTop: "-15rem",
                    }}
                  >
                    <h2
                      style={{
                        color: "#a3238e",
                        fontWeight: "bold",
                        //marginTop: "4rem",
                        fontSize: "25px",
                        textAlign: "justify",
                      }}
                    >
                      {info.type}
                    </h2>

                    <p
                      style={{
                        marginTop: "2rem",
                        fontSize: "16px",
                        textAlign: "justify",
                      }}
                    >
                      {info.data}
                    </p>
                  </div>
                </div>
              </Col>
              <Col sm={0} md={0} lg={2}></Col>
            </Col>
          </Row>
        </Col>
        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#f7f7f7",
          }}
        ></Col>
      </Row>
      <Row>
        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#efefef",
          }}
        ></Col>
        <Col
          sm={12}
          md={12}
          lg={10}
          style={{
            backgroundColor: "#efefef",
            paddingBottom: "2rem",
          }}
          className="flex-colunm align-items-center justify-content-center w-100 form-div"
        >
          <Col xs="12" sm="12" md="12">
            <h1
              className="form-text-div mt-0 text-center"
              style={{ color: "#a3238e", fontSize: "35px" }}
            >
              Have any queries? Write to us
            </h1>
          </Col>
          <Col xs="12" sm="12" md="12" style={{ padding: "2rem" }}>
            <form className="w-100">
              <Row className="justify-content-center align-items-center">
                <Col className="" xs="12" sm="12" md="4">
                  <Row>
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
                      rows="4"
                      placeholder="Message"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.message && touched.message ? (
                      <div className="errorMessage">{errors.message}</div>
                    ) : null}
                  </Row>
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignContent: "center",
                    }}
                  >
                    <Col xs="12" sm="12" md="6" lg="4">
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
              </Row>
            </form>
          </Col>
        </Col>
        <Col
          sm={0}
          md={0}
          lg={1}
          style={{
            backgroundColor: "#efefef",
          }}
        ></Col>
      </Row>
      <FinalBarComponent />
    </Container>
  );
};
const mapDispatchToProps = {
  PostContact: (payload) => postContactList(payload),
};

export default connect(null, mapDispatchToProps)(ServicesComponent);
