import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import {
  getProductById,
  getRelatedProductList,
  productCategory,
} from "../../application/services/actions/auth";
import { IoIosAdd, IoMdAddCircle } from "react-icons/io";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./navstlye.scss";
import { Card } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import * as yup from "yup";
import { updateNotificationCount } from "../../application/services/actions/count";
import { useFormik } from "formik";
import GenericModal from "./GenericModal";
import { toast } from "react-toastify";

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
const RelatedProducts = (props) => {
  const [listOfRelatedProducts, setRelatedProductList] = useState([]);
  const [relatedProductCardIndex, setrelatedProductCardIndex] = useState(1);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSingleQuantity, setIsSingleQuantity] = useState(true);
  const [isMultipleQuantity, setIsMultipleQuantity] = useState(false);
  const [inputBoxes, setInputBoxes] = useState([""]);
  const [selectedCardDetails, setSelectedCardDetails] = useState(null);
  const [selectedProduct, setselectedProduct] = useState(
    listOfRelatedProducts?.[1] || {}
  );
  const location = useLocation();
  const { state } = location;
  let navigate = useNavigate();

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const relativeProductResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const CustomButtonGroup = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          relatedProductCardIndex === 1
            ? null
            : setrelatedProductCardIndex(relatedProductCardIndex - 1);
        }}
        size={"20px"}
        className={
          listOfRelatedProducts.length <= 2
            ? "ArrowIcon2"
            : relatedProductCardIndex === 1
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          listOfRelatedProducts.length <= 2
            ? null
            : (screenSize.width < 464
                ? listOfRelatedProducts.length
                : listOfRelatedProducts.length - 2) === relatedProductCardIndex
            ? null
            : setrelatedProductCardIndex(relatedProductCardIndex + 1);
        }}
        size={"20px"}
        className={
          listOfRelatedProducts.length <= 2
            ? "ArrowIcon2"
            : (screenSize.width < 464
                ? listOfRelatedProducts.length
                : listOfRelatedProducts.length - 2) === relatedProductCardIndex
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
    </div>
  );

  const relatedProductList = (pageNumber) => {
    const catalogId = state?.productDetail?.catalogId
      ? state?.productDetail?.catalogId
      : state?.catalogId;
    let payload = {
      pageNumber: 1,
      pageSize: 10,
      catalogId: catalogId,
      sortField: "",
      sortDirection: "",
      filterName: "",
      filterValue: "",
      multipleFilters: [
        {
          filterName: "",
          filterValue: 0,
        },
      ],
      category: "",
    };

    props
      .getRelatedProductList(payload)
      .then((res) => {
        setRelatedProductList(res?.data?.result);
        setRelatedProductsPageNumber(pageNumber ? pageNumber : 1);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    relatedProductList();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [state.productDetail]);

  const filteredProducts = listOfRelatedProducts.filter(
    (item) => item.chemicalName !== null
  );

  const handleShowModal = (cardDetails) => {
    setSelectedCardDetails(cardDetails); // Store the selected card details
    setShowModal(true);
  };

  const handleHideModal = () => {
    setSelectedCardDetails(null); // Clear the selected card details when modal is hidden
    setShowModal(false);
  };

  const data = listOfRelatedProducts.map((item) => ({
    id: item.id,
    chemicalName: item.chemicalName,
  }));

  const formHandler = () => {
    const tempData = [...props.enquireListData];
    let compoundDetails;
    if (isSingleQuantity) {
      compoundDetails = {
        compound: {
          id: selectedCardDetails.id,
          value: selectedCardDetails.chemicalName,
          label: selectedCardDetails.chemicalName,
        },
        mg: values.mg,
        isInterMediate: isChecked,
        showEdit: false,
        readOnly: true,
      };

      const isDuplicate = tempData.some(
        (item) =>
          item.compound.id === compoundDetails.compound.id &&
          item.mg === compoundDetails.mg
      );

      if (isDuplicate) {
        toast.error(
          "This chemical and quantity combination is already in the list.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          }
        );
        return;
      }
    } else {
      const newCompoundDetails = values?.mg?.map((mgValue) => ({
        compound: {
          id: selectedCardDetails.id,
          value: selectedCardDetails.chemicalName,
          label: selectedCardDetails.chemicalName,
        },
        mg: mgValue,
        isInterMediate: isChecked,
        showEdit: false,
        readOnly: true,
      }));

      for (const newDetail of newCompoundDetails) {
        const isDuplicate = tempData.some(
          (item) =>
            item.compound.id === newDetail.compound.id &&
            item.mg === newDetail.mg
        );

        if (isDuplicate) {
          toast.error(
            "This chemical and quantity combination is already in the list.",
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 3000,
            }
          );
          return; // Do not proceed with adding the duplicate quantity
        }
      }

      compoundDetails = newCompoundDetails;
    }
    if (Array.isArray(compoundDetails)) {
      tempData.push(...compoundDetails);
    } else {
      tempData.push(compoundDetails);
    }
    props.updateNotification(tempData);
    handleReset();
    navigate("/enquirylist", { state: data });
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    handleReset,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      compound: {
        id: selectedProduct?.id,
        value: selectedProduct?.chemicalName,
        label: selectedProduct?.chemicalName,
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleAddButtonClick = () => {
    if (isMultipleQuantity === true) {
      setInputBoxes([...inputBoxes, ""]); // Add an empty string to the inputBoxes array
    }
  };
  const handleSingleQuantityChange = () => {
    setIsSingleQuantity(!isSingleQuantity);
    setIsMultipleQuantity(false);
    setInputBoxes([""]);
    setFieldValue("mg", "");
  };

  const handleMultipleQuantityChange = () => {
    setIsMultipleQuantity(!isMultipleQuantity);
    setIsSingleQuantity(false);
    setInputBoxes([""]);
    setFieldValue("mg", "");
  };
  const handleInputBoxChange = (e, index) => {
    const newInputBoxes = [...inputBoxes];
    newInputBoxes[index] = e.target.value;
    setInputBoxes(newInputBoxes);

    // Update mg value in state
    setFieldValue("mg", newInputBoxes);
  };

  // body content
  const renderBody = () => {
    return (
      <div className="modal-body border-0">
        <div className="d-flex gap-4">
          <div className="form-group d-flex align-items-center">
            <input
              type="checkbox"
              id="radioOption1"
              name="radioOptions"
              value="option1"
              checked={isSingleQuantity}
              onChange={handleSingleQuantityChange}
            />
            <label
              htmlFor="radioOption1"
              style={{ fontSize: "14px", marginLeft: "2px" }}
            >
              Single Quantity
            </label>
          </div>
          <div className="form-group d-flex align-items-center">
            <input
              type="checkbox"
              id="radioOption2"
              name="radioOptions"
              value="option2"
              checked={isMultipleQuantity}
              onChange={handleMultipleQuantityChange}
            />
            <label
              htmlFor="radioOption2"
              style={{ fontSize: "14px", marginLeft: "2px" }}
            >
              Multiple Quantity
            </label>
          </div>
        </div>
        <div className="form-group">
          {isSingleQuantity === true ? (
            <input
              type="text"
              className="form-control bg-light mt-2 hover-outline"
              placeholder="Quantity in Mg*"
              value={values.mg}
              onChange={handleChange("mg")}
            />
          ) : (
            inputBoxes.map((value, index) => (
              <input
                key={index}
                type="text"
                id={`textInput${index}`}
                className="form-control bg-light mt-2 hover-outline"
                placeholder="Quantity in Mg*"
                value={value}
                onChange={(e) => handleInputBoxChange(e, index)}
              />
            ))
          )}
          {errors.mg && touched.mg ? (
            <div className="errorMessage">{errors.mg}</div>
          ) : null}
        </div>
        {isMultipleQuantity && (
          <div className="text-center">
            <button
              className="border-0 bg-white mt-4 "
              onClick={handleAddButtonClick}
            >
              <IoMdAddCircle fontSize={"33px"} color={"#F38B3A"} />
            </button>
          </div>
        )}
      </div>
    );
  };
  // footer content
  const renderFooterContent = (cardDetails) => {
    // Custom footer component
    return (
      <div className="modal-footer border-0 d-flex justify-content-between gap-4">
        <label className="checkbox">
          <p className="Draft">Draft&nbsp;COA</p>
          <input
            type="checkbox"
            className={`check ${isChecked ? "checked" : ""}`}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </label>
        <button type="submit" className="btn-style" onClick={handleSubmit}>
          <div className="d-flex align-items-center">
            <IoIosAdd
              fontSize={"30px"}
              color="#fff"
              style={{ marginLeft: "6px" }}
            />
            <span
              style={{
                marginLeft: "6px",
                marginRight: "6px",
                marginTop: "2px",
                color: "white",
              }}
            >
              Add
            </span>
          </div>
        </button>
      </div>
    );
  };
  return (
    <div>
      {/* Related-Products */}

      {isLoading ? (
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "24px", marginBottom: "24px", color: "#a3238e" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts && filteredProducts.length ? (
        <Row className=" section3-product">
          <h1 className="para">Related Products</h1>

          <Carousel
            additionalTransfrom={0}
            arrows={false}
            customButtonGroup={<CustomButtonGroup />}
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside
            responsive={relativeProductResponsive}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
          >
            {filteredProducts.map((cardDetails, index) => {
              const relatedProductCenterCardIndex = 10;
              return (
                <div key={index} className="custom-card-category-wrapper">
                  <div>
                    <Card
                      className="custom-card-category"
                      style={{ marginLeft: "-4%" }}
                      {...(filteredProducts.length <= 3
                        ? "custom-card"
                        : index === relatedProductCenterCardIndex
                        ? "custom-card-2"
                        : "custom-card")}
                    >
                      <Card.Body>
                        <Card.Title>
                          <span className="titleName">
                            {cardDetails?.chemicalName
                              ? cardDetails.chemicalName
                              : " --"}
                          </span>
                        </Card.Title>

                        <div className="card-div">
                          {cardDetails.productImage ? (
                            <img
                              src={cardDetails?.productImage}
                              alt="Product Image"
                              className="product-image"
                            />
                          ) : (
                            <span className="titleName">No Image Found</span>
                          )}
                        </div>
                        <h6 className="text">
                          <span className="titleName card-text">
                            Molecular Formula :{" "}
                            <span className="sub-text card-text">
                              {cardDetails.molecularFormula
                                ? cardDetails.molecularFormula.length > 12
                                  ? `${cardDetails.molecularFormula.slice(
                                      0,
                                      12
                                    )}...`
                                  : cardDetails.molecularFormula
                                : " --"}
                            </span>
                          </span>
                        </h6>
                        <h6 className="text">
                          <span className="titleName card-text">
                            CAS Number :{" "}
                            <span className="sub-text card-text">
                              {cardDetails.casNumber
                                ? cardDetails.casNumber
                                : " --"}
                            </span>
                          </span>
                        </h6>
                        <Row>
                          <Col>
                            <button className="product-button">
                              More Details
                            </button>
                          </Col>
                          <Col>
                            <button
                              onClick={() => handleShowModal(cardDetails)}
                              className="product-button"
                            >
                              Add to Enquiry
                            </button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              );
            })}
          </Carousel>
          {/* Render the GenericModal outside the loop */}
          {selectedCardDetails && (
            <GenericModal
              show={showModal}
              onHide={handleHideModal}
              title={
                selectedCardDetails?.chemicalName?.length > 12
                  ? selectedCardDetails?.chemicalName?.slice(0, 12) + "..."
                  : selectedCardDetails?.chemicalName
              }
              subtitle ="CAT Number"
              subtitletext={
                selectedCardDetails.casNumber
                  ? selectedCardDetails.casNumber
                  : "--"
              }
              body={renderBody()}
              confirmText="Confirm"
              child={renderFooterContent(selectedCardDetails)} // Pass cardDetails to the function
            />
          )}
        </Row>
      ) : null}
    </div>
  );
};
const mapStateToProps = ({ countReducer: { enquireListData } }) => ({
  enquireListData,
});
const mapDispatchToProps = {
  getProductBy: (payloadData) => getProductById(payloadData),
  getRelatedProductList: (payloadData) => getRelatedProductList(payloadData),
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
  productCategory: (payloadData) => productCategory(payloadData),
};

export default connect(mapStateToProps, mapDispatchToProps)(RelatedProducts);
