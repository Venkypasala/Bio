import React, { useState, useEffect } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import HeaderComponent from "../Header/HeaderComponent";
import { MdOutlineCancel, MdCancel } from "react-icons/md";
import FinalBarComponent from "../FinalBar/FinalBarComponent";
import { IoFilterSharp } from "react-icons/io5";
import {
  getProductById,
  productCategory,
} from "../../application/services/actions/auth";

import { connect } from "react-redux";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "./navstlye.scss";
import * as yup from "yup";
import { updateNotificationCount } from "../../application/services/actions/count";
import { useFormik } from "formik";
import RelatedProducts from "./RelatedProducts";

const ValidationSchema = yup.object().shape({
  compound: yup.object().nullable(),
  mg: yup
    .number()
    .nullable()
    .required("Please enter Quantity.")
    .typeError("Please enter a valid numeric value."),
  isInterMediate: yup.boolean().default(false),
  isSingleQuantity: yup.boolean().default(true),
  showEdit: yup.boolean().default(false),
  readOnly: yup.boolean().default(true),
});

const DetailPage = (props) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const [activetab, setActiveTab] = useState(1);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [searchCategory, setsearchCategory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { state } = location;
  let navigate = useNavigate();
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

  let finalProductInfo = state?.productDetail?.productDetails
    ? JSON.parse(state?.productDetail?.productDetails)
    : {};
  let finalProductImage = state?.productDetail;
  let product_Detail = data?.data?.productDetails
    ? JSON.parse(data?.data?.productDetails)
    : {};

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  const formHandler = () => {
    const tempData = [...props.enquireListData];
    let conpondDetails;

    conpondDetails = {
      compound: {
        id: data?.id,
        value: finalProductImage?.chemicalName
          ? finalProductImage?.chemicalName
          : data?.data?.chemicalName,
        label: data?.chemicalName,
      },
      mg: values.mg,
      isInterMediate: isChecked,
      showEdit: false,
      readOnly: true,
    };

    tempData.push(conpondDetails);
    props.updateNotification(tempData);
    handleReset();
    navigate("/enquirylist", { state: data });
  };
  const { handleSubmit, handleChange, handleReset, values, errors, touched } =
    useFormik({
      initialValues: {
        compound: {
          id: data?.id,
          value: finalProductImage?.chemicalName
            ? finalProductImage?.chemicalName
            : data?.data?.chemicalName,
          label: data?.chemicalName,
        },
        mg: "",
        isInterMediate: false,
      },
      enableReinitialize: true,
      validateOnBlur: true,
      validateOnChange: true,
      onSubmit: (value) => formHandler(value),
      validationSchema: ValidationSchema,
      validateOnMount: true,
    });

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
  ];

  const paragraphStyle = {
    fontSize: "18px",
    color: "#F38B3A",
    fontWeight: "bold",
  };

  // fetching api data
  const fetchProductById = () => {
    const productId = state?.productDetail?.id || state?.id;
    props
      .getProductBy(productId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {});
  };
  // fetching api search-category
  const fetchsearcgCategory = () => {
    const productId = state?.productDetail?.id
      ? state?.productDetail?.id
      : state?.id;
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 10,
      sortDirection: "",
      sortField: "",
      productId: productId,
      categoryName: "",
    };

    props
      .productCategory(payload)
      .then((res) => {
        setsearchCategory(res);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchProductById();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    fetchsearcgCategory();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [state.productDetail]);

  const handleClose = () => setShow(false);

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };

  return (
    <div className="container-fluid ">
      {/* Nav-bar */}
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
            className="modal-close-button "
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
      <Row className="section1-product align-items-center"></Row>

      <div
        className="row justify-content-center"
        style={{
          padding: "30px",
          marginBottom: "0px",
          backgroundColor: "#efefef",
        }}
      >
        {/* search-tab */}
        <div
          className="col-md-8 searchBar "
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {/* Centered box */}
          <div className="d-flex">
            <div
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <IoFilterSharp
                type="button"
                style={{
                  fontSize: "32px",
                  marginLeft: "12px",
                  marginTop: "30px",
                }}
              />
            </div>
            <div
              style={{
                width: "2px",
                height: "40px",
                backgroundColor: "#a3238e",
                marginTop: "25px",
                marginLeft: "20px",
              }}
            />

            <div className=" mx-auto" style={{ height: "90px" }}>
              <p
                className="my-1"
                style={{
                  color: "#a3238e",
                  fontWeight: "bolder",
                  fontSize: "18px",
                  textAlign: "center",
                  // marginBottom: "20px",
                  paddingTop: "10px",
                }}
              >
                {finalProductImage?.chemicalName.length > 50 ? (
                  <span>
                    {finalProductImage?.chemicalName?.slice(0, 50)}...
                  </span>
                ) : (
                  <span>
                    {finalProductImage?.chemicalName
                      ? finalProductImage?.chemicalName
                      : data?.data?.chemicalName.length > 50
                      ? data?.data?.chemicalName?.slice(0, 50) + "..."
                      : data?.data?.chemicalName}
                  </span>
                )}
              </p>
              <p>
                <nav
                  aria-label="breadcrumb"
                  className="nav justify-content-center"
                >
                  <ol class="breadcrumb">
                    {tabs.map((tab, index) => (
                      <li
                        className="breadcrumb-item "
                        aria-current="page"
                        key={index}
                      >
                        <NavLink
                          style={{ margin: "8px" }}
                          className={activetab === index ? "act" : "tabStyles"}
                          to={tab.path}
                          onClick={() => handleTabClick(index)}
                        >
                          {tab.label}
                        </NavLink>
                      </li>
                    ))}
                    <li className="breadcrumb-item">
                      <a
                        style={{
                          margin: "8px",
                          fontWeight: "300",
                          fontSize: "18px",
                        }}
                      >
                        {finalProductImage?.chemicalName.length > 15 ? (
                          <span>
                            {finalProductImage?.chemicalName?.slice(0, 15)}...
                          </span>
                        ) : (
                          <span>
                            {finalProductImage?.chemicalName
                              ? finalProductImage?.chemicalName
                              : data?.data?.chemicalName.length > 15
                              ? data?.data?.chemicalName?.slice(0, 15) + "..."
                              : data?.data?.chemicalName}
                          </span>
                        )}
                      </a>
                    </li>
                  </ol>
                </nav>
              </p>
            </div>
          </div>
        </div>
        {/* card-working standrard */}
        <div className="row" style={{ marginTop: "40px" }}>
          <div className="col-lg-6 col-md-12 ">
            <h1
              style={{
                color: "#a3238e",
                fontSize: "27px",
                fontWeight: "bolder",
                marginLeft: "33%",
                marginBottom: "10px",
              }}
            >
              {finalProductImage?.chemicalName.length > 15 ? (
                <span>{finalProductImage?.chemicalName?.slice(0, 15)}...</span>
              ) : (
                <span>
                  {finalProductImage?.chemicalName
                    ? finalProductImage?.chemicalName
                    : data?.data?.chemicalName.length > 15
                    ? data?.data?.chemicalName?.slice(0, 15) + "..."
                    : data?.data?.chemicalName}
                </span>
              )}
            </h1>
            {/* Half-width child div 1 */}
            <div className="card-style">
              <h3
                style={{
                  marginLeft: "40px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  paddingTop: "10px",
                }}
              >
                Molecular diagram
              </h3>

              {finalProductImage?.productImage || data?.data?.productImage ? (
                <img
                  className="chemical-img"
                  src={
                    finalProductImage?.productImage
                      ? finalProductImage?.productImage
                      : data?.data?.productImage
                  }
                  alt="Product Image"
                  style={{
                    transition: "transform 0.3s",
                    marginBottom: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.2)"; // Increase the size of the image on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // Reset the size of the image on mouse leave
                  }}
                />
              ) : (
                <span
                  style={{
                    marginLeft: "40px",
                  }}
                >
                  No Image Available
                </span>
              )}
            </div>
          </div>
          <div className="col-lg-6  col-md-12 mx-auto">
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {(() => {
                const allCategories = searchCategory?.data?.result?.map(
                  (catname) => catname?.categoryName
                );
                return allCategories?.join(", ");
              })()}
            </h1>
            {/* Half-width child div 2 */}
            <div>
              <p className="mt-4">
                <span style={paragraphStyle}>Synonyms</span> :{" "}
                {finalProductInfo?.Synonyms || finalProductInfo?.synonyms
                  ? finalProductInfo?.Synonyms || finalProductInfo?.synonyms
                  : product_Detail?.Synonyms || product_Detail?.synonyms}
              </p>
              <p className="mt-4">
                <span style={paragraphStyle}>CAS Number</span> :{" "}
                {finalProductImage?.casNumber
                  ? finalProductImage?.casNumber
                  : data?.data?.casNumber}
              </p>
              <p className="mt-4">
                <span style={paragraphStyle}>CAT Number</span> :{" "}
                {state?.productDetail?.catId
                  ? state?.productDetail?.catId
                  : data?.data?.catId}
              </p>

              <p className="mt-4">
                <span style={paragraphStyle}>Molecular Formula</span> :{" "}
                {finalProductImage?.molecularFormula
                  ? finalProductImage?.molecularFormula
                  : data?.data?.molecularFormula}
              </p>

              <p className="mt-4">
                <span style={paragraphStyle}>Molecular Weight</span> :{" "}
                {finalProductImage?.molecularWeight
                  ? finalProductImage?.molecularWeight
                  : data?.data?.molecularWeight}
              </p>
              <p className="mt-4">
                <span style={paragraphStyle}> Purity</span> : {"> 98 %"}
              </p>

              <p className="mt-4">
                <span style={paragraphStyle}>Storage Condition</span> :{" "}
                {"Store at 2-8°C"}
              </p>
            </div>
          </div>
          <div className="d-flex gap-5 mt-5 justify-content-center">
            <div>
              <input
                style={{
                  border: "2px solid #a3238e",
                  padding: "8px",
                  borderRadius: "8px",
                }}
                value={values.mg}
                placeholder="Quantity in Mg*"
                onChange={handleChange("mg")}
              />

              {errors.mg && touched.mg ? (
                <div className="errorMessage">{errors.mg}</div>
              ) : null}
            </div>
            <div>
              <label className="checkbox">
                <p className="Draft">Draft&nbsp;COA</p>
                <input
                  type="checkbox"
                  className={`check ${isChecked ? "checked" : ""}`}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
            <button
              className="detail-button p-2 "
              type="submit"
              onClick={handleSubmit}
            >
              Add to Enquiry
            </button>
          </div>
        </div>
      </div>
      {/* modal body */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          marginTop: "300px",
          transform: "translateX(-50%)",
          left: "22%",
        }}
      >
        <div className="modal-dialog" style={{ width: "250px" }}>
          <div
            className="modal-content"
            style={{
              border: "1px solid #a3238e",
              backdropFilter: "blur(8px)",
            }}
          >
            <MdCancel
              type="button"
              data-bs-dismiss="modal"
              fontSize={"25px"}
              style={{ marginLeft: "190px", marginTop: "6px" }}
            />

            <div
              className="modal-body text-center"
              style={{ maxHeight: "300px", overflow: "auto" }}
            >
              {searchCategory?.data?.result &&
              searchCategory?.data?.result.length > 0
                ? searchCategory?.data?.result?.map((catname, id) => {
                    let categoryData = catname?.categoryName.replace(/;/g, "");
                    return (
                      <p key={id} style={{ color: "#a3238e" }}>
                        {categoryData}
                      </p>
                    );
                  })
                : "Category not mapped"}
            </div>
          </div>
        </div>
      </div>

      {/* Related-Products */}
      <RelatedProducts />

      <div>
        <FinalBarComponent />
      </div>
    </div>
  );
};
const mapStateToProps = ({ countReducer: { enquireListData } }) => ({
  enquireListData,
});
const mapDispatchToProps = {
  getProductBy: (payloadData) => getProductById(payloadData),
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
  productCategory: (payloadData) => productCategory(payloadData),
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
