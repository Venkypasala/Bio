import React, { useState, useEffect } from "react";
import HeaderComponent from "../Header/HeaderComponent";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import AddListItem from "./components/AddListItem";
import { connect } from "react-redux";
import { postEnquiryList } from "../../application/services/actions/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../infrastructure/components/Loader/Loader";
import { updateNotificationCount } from "../../application/services/actions/count";
import { useSelector } from "react-redux";
const ValidationSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .nullable()
    .required("Name is required."),
  email: yup.string().nullable().email().required("Email is required."),
  phoneNumber: yup
    .string()
    .matches(/^\S*$/, "Space is not allowed")
    .min(10, "Number should not be less than 10 Digit")
    .max(10, "Number should not be more than 10 Digit")
    .matches(/(?=.*?\d)^\$?(([1-9]\d{0,9}))?$/, "Only number allowed")
    .matches(
      /^[^!@#$%^&*()\"/?'=+{}; :,<.>]*$/,
      "Special character is not allowed"
    )
    .typeError("That doesn't look like a phone number")
    .required(`PhoneNumber is required`),
  companyName: yup.string().nullable().required("CompanyName is required."),
});
export const EnquiryListComponent = (props) => {
  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState();
  const [SelectedItem, setSelectedItem] = useState("");
  const [enquiryList, setEnquiryList] = useState(props.enquireListData || []);


  const formHandler = async () => {
    setStatus(true);

    const payload = {
      type: "",
      emailId: values.email,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      companyName: values.companyName,
      compounds: enquiryList.map((item) => {
        return {
          compoundName: item.compound.value,
          mg: [item.mg],
          isDraftCOA: item.isInterMediate,
        };
      }),
      enquiryContactJson: "",
      message: "",
    };

    await props
      .PostEnquiryList(payload)
      .then((res) => {
        setStatus(false);
        toast.success(res.message.message || "Success", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });

        props.updateNotification([]);
        handleReset();
        setEnquiryList([]);
      })
      .catch((error) => {
        setStatus(false);
        toast.error(error?.message || "Something went wrong.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
  const OnChangeHandler = (fieldName, e) => {
    setFieldValue(fieldName, e.target.value);
  };
  const RemovedHandler = (item) => {
    const updatedList = enquiryList.filter((filterItem) => filterItem !== item);
    setEnquiryList(updatedList);
    props.updateNotification(updatedList);
    setShowRemoveModal(false);
    setShow(false);
  };

  const {
    handleSubmit,
    setFieldValue,
    values,
    touched,
    errors,
    handleReset,
    handleBlur,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (value) => formHandler(value),
    validationSchema: ValidationSchema,
    validateOnChange: true,
  });

  
  const updateEnquiryList = (item, newData = {}) => {
    setEnquiryList([
      ...enquiryList.map((el) => {
        if (el?.compound?.id === item?.compound?.id && el?.mg === item?.mg) {
          el = { ...el, ...newData };
          return el;
        } else {
          return el;
        }
      }),
    ]);
  };

  const handleClose = () => {
    setShowRemoveModal(false);
    setShow(false);
  };

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };
  const isFormValid =
    Object.keys(errors).length === 0 && Object.keys(touched).length !== 0;
  return (
    <>
      <Container fluid className="main">
        {status ? <Loader status={status} /> : null}
        <Row className="w-100">
          <Col
            className="navbar-section web-closer-setion text-end"
            xs={12}
            md={12}
            lg={12}
          >
            <HeaderComponent notificationCount={enquiryList.length} />
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
                  Leave the Site?
                </h3>
                <p
                  style={{
                    textAlign: "center",

                    top: "4rem",
                    left: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  Submit enquiry before Leaving
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
                    onClick={() => setShow(false)}
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
                    // onClick={() => setShow(false)}
                    onClick={() => handleCancelButton()}
                  >
                    NO
                  </button>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              show={showRemoveModal}
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
                  You Want to remove this product from enquiry
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
                    onClick={() => RemovedHandler(SelectedItem)}
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
                    onClick={() => setShowRemoveModal(false)}
                  >
                    NO
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>

        <Row className="section1">
          <Col sm={12} md={12} lg={6}>
            <Row className="justify-content-end mb-4">
              {enquiryList && enquiryList?.length ? (
                <div style={{ justifyContent: "flex-start" }}>
                  <NavLink to="/products" className="resume-btn-enq">
                    Resume Browsing
                  </NavLink>
                </div>
              ) : null}
              <Col xs="12" className="mostly-customized-scrollbar">
                <div className="mostly-customized-scrollbar-inner">
                  {enquiryList && enquiryList?.length ? (
                    enquiryList?.map((item, index) => (
                      <Row
                        key={item?.compund?.id || index}
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "10px",
                          minHeight: "40px",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: index > 0 ? "10px" : 0,
                          padding: "10px 6px",
                        }}
                      >
                        <Col
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span style={{ marginBottom: 0 }}>
                              {item?.compound?.value}
                            </span>
                          </div>
                        </Col>
                        <Col>
                          <div
                            onMouseEnter={() => {
                              updateEnquiryList(item, {
                                showEdit: true,
                              });
                            }}
                            onMouseLeave={() => {
                              updateEnquiryList(item, {
                                showEdit: false,
                              });
                            }}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {item.showEdit && item.readOnly ? (
                              <button
                                className="edit_btn"
                                onClick={() => {
                                  updateEnquiryList(item, {
                                    showEdit: false,
                                    readOnly: false,
                                  });
                                }}
                              >
                                Edit <MdEdit />
                              </button>
                            ) : (
                              <input
                                type="number"
                                name="edit_mg"
                                className="form-control "
                                pattern="/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{4})*)|\d+)?(\.\d{1,2})?$/"
                                required={true}
                                maxLength={4}
                                value={`${item.mg}`}
                                readOnly={item.readOnly}
                                onChange={(e) => {
                                  updateEnquiryList(item, {
                                    mg: e.currentTarget.value,
                                  });
                                }}
                                onBlur={() => {
                                  updateEnquiryList(item, {
                                    showEdit: false,
                                    readOnly: true,
                                  });
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div className="checkbox-container">
                            <input
                              className="check-input-label Draft-style"
                              id={item?.compound?.id}
                              type="checkbox"
                              checked={item?.isInterMediate}
                              onChange={(e) => {
                                updateEnquiryList(item, {
                                  isInterMediate: e.currentTarget.checked,
                                });
                              }}
                            />
                            <label
                              htmlFor={item?.compound?.id}
                              className="check-input-label Draft-style ms-2"
                            >
                              Draft COA
                            </label>
                          </div>
                        </Col>
                        <Col xs={1} md={1} lg={1}>
                          <CgClose
                            type="button"
                            onClick={() => {
                              setShowRemoveModal(true);
                              setSelectedItem(item);
                            }}
                          />
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row className=" align-items-center justify-content-center mostly-customized-scrollbar-inner">
                      <Col xs="12">
                        <h2 className="list-text text-center w-100">
                          Your list is empty
                        </h2>
                      </Col>
                    </Row>
                  )}
                </div>
              </Col>
            </Row>

            <Row className="justify-content-end pt-4">
              <Col xs="12" sm="12" md="12" lg="12">
                <AddListItem
                  setEnquiryList={setEnquiryList}
                  enquiryList={enquiryList}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <Row
              sm={12}
              md={12}
              lg={6}
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <h2 className="h21" style={{ paddingLeft: "20%" }}>
                  Fill the form to
                </h2>
                <h2 className="h22" style={{ paddingLeft: "20%" }}>
                  get the Quote
                </h2>
              </div>
              <div
                style={{
                  marginTop: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  name="fullName"
                  value={values.fullName}
                  className="input-style"
                  placeholder="Full Name"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    OnChangeHandler("fullName", e);
                  }}
                />

                {errors.fullName && touched.fullName ? (
                  <div className="errorMessage">{errors.fullName}</div>
                ) : null}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  name="email"
                  value={values.email}
                  className="input-style"
                  placeholder="Mail ID"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    OnChangeHandler("email", e);
                  }}
                />
                {errors.email && touched.email ? (
                  <div className="errorMessage">{errors.email}</div>
                ) : null}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  className="input-style"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    OnChangeHandler("phoneNumber", e);
                  }}
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className="errorMessage">{errors.phoneNumber}</div>
                ) : null}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  className="input-style"
                  placeholder="Company Name"
                  name="companyName"
                  value={values.companyName}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    OnChangeHandler("companyName", e);
                  }}
                />
                {errors.companyName && touched.companyName ? (
                  <div className="errorMessage">{errors.companyName}</div>
                ) : null}
              </div>
            </Row>
            <Row
              sm={12}
              md={12}
              lg={6}
              style={{
                marginTop: "15px",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Col lg={4}></Col>
              <Col lg={2}>
                <button
                  type={"submit"}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={
                    !isFormValid ? "submit-button-disable" : "submit-button"
                  }
                >
                  Submit
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapStateToProps = ({ countReducer: { enquireListData } }) => ({
  enquireListData,
});

const mapDispatchToProps = {
  PostEnquiryList: (payload) => postEnquiryList(payload),
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnquiryListComponent);
