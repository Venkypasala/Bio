import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { IoIosAdd, IoMdAddCircle } from "react-icons/io";
import Carousel from "react-multi-carousel";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { getProductByCategory } from "../../application/services/actions/auth";
import { updateNotificationCount } from "../../application/services/actions/count";
import { connect } from "react-redux";
import Loader from "../../infrastructure/components/Loader/Loader";
import GenericModal from "./GenericModal";
import "./navstlye.scss";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
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

const CategoryComponent = (props) => {
  const [status, setStatus] = useState(false);
  const [listOfStandardsProduct, setListOfStandardProducts] = useState([]);
  const [listOfMetablolitesProduct, setListOfMetabolitesProducts] = useState(
    []
  );
  const [listOfIsotopeProduct, setListOfIsotopeProducts] = useState([]);
  const [standardPageNumber, setStandardPageNumber] = useState(1);
  const [metabolitesPageNumber, setMetabolitesPageNumber] = useState(1);
  const [isotopePageNumber, setIsotopePageNumber] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [showModalStandards, setShowModalStandards] = useState(false);
  const [showModalIsotope, setShowModalIsotope] = useState(false);
  const [showModalMetabolites, setShowModalMetabolites] = useState(false);
  const [isSingleQuantity, setIsSingleQuantity] = useState(true);
  const [isMultipleQuantity, setIsMultipleQuantity] = useState(false);
  const [inputBoxes, setInputBoxes] = useState([""]);
  const [chemName, setchemName] = useState("");

  
  let navigate = useNavigate();
  const StandardsProduct = listOfStandardsProduct.map((cardDetails) => {
    return cardDetails;
  });

  const isotopeProduct = listOfIsotopeProduct.map((cardDetails) => {
    return cardDetails;
  });
  const MetablolitesProduct = listOfMetablolitesProduct.map((cardDetails) => {
    return cardDetails;
  });

  let data = {};
  let data_1 = {};
  let data_2 = {};

  if (StandardsProduct.length > 0 && StandardsProduct[0].chemicalName) {
    data = StandardsProduct[0].chemicalName;
  }

  if (isotopeProduct.length > 0 && isotopeProduct[0].chemicalName) {
    data_1 = isotopeProduct[0].chemicalName;
  }
  if (MetablolitesProduct.length > 0 && MetablolitesProduct[0].chemicalName) {
    data_2 = MetablolitesProduct[0].chemicalName;
  }

  const formHandler = () => {
    const tempData = [...props.enquireListData];
    let compoundDetails;

    if (isSingleQuantity) {
      compoundDetails = {
        compound: {
          id: listOfStandardsProduct[0]?.id,
          value:
            chemName === data
              ? data
              : chemName === data_1
              ? data_1
              : chemName === data_2
              ? data_2
              : "",
          label: data?.chemicalName,
        },
        mg: values.mg,
        isInterMediate: isChecked,
        showEdit: false,
        readOnly: true,
      };

      const isDuplicate = tempData.some(
        (item) =>
          item.compound.value === compoundDetails.compound.value &&
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
        return; // Do not proceed with adding the duplicate quantity
      }
    } else {
      const newCompoundDetails = values.mg.map((mgValue) => ({
        compound: {
          key: listOfStandardsProduct[0]?.id,
          id: listOfStandardsProduct[0]?.id,
          value:
            chemName === data
              ? data
              : chemName === data_1
              ? data_1
              : chemName === data_2
              ? data_2
              : "",
          label: data,
        },
        mg: mgValue,
        isInterMediate: isChecked,
        showEdit: false,
        readOnly: true,
      }));

      for (const newDetail of newCompoundDetails) {
        const isDuplicate = tempData.some(
          (item) =>
            item.compound.value === newDetail.compound.value &&
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

    // Moved navigation outside the if/else blocks
    // Navigate only if there are no duplicates
    navigate("/enquirylist", { state: data });

    props.updateNotification(tempData);
    handleReset();
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
        id: listOfStandardsProduct[0]?.id,
        value:
          chemName === data
            ? data
            : chemName === data_1
            ? data_1
            : chemName === data_2
            ? data_2
            : "",
        label: data,
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

  const handleShowModalStandards = () => setShowModalStandards(true);
  const handleHideModalStandards = () => setShowModalStandards(false);

  const handleShowModalIsotope = () => setShowModalIsotope(true);
  const handleHideModalIsotope = () => setShowModalIsotope(false);

  const handleShowModalMetabolites = () => setShowModalMetabolites(true);
  const handleHideModalMetabolites = () => setShowModalMetabolites(false);

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
    setFieldValue("mg", ""); // Clear the formik value for mg
  };

  const handleMultipleQuantityChange = () => {
    setIsMultipleQuantity(!isMultipleQuantity);
    setIsSingleQuantity(false);
    setInputBoxes([""]); // Reset inputBoxes to have a single empty string
    setFieldValue("mg", ""); // Clear the formik value for mg
  };
  const handleInputBoxChange = (e, index) => {
    const newInputBoxes = [...inputBoxes];
    newInputBoxes[index] = e.target.value;
    setInputBoxes(newInputBoxes);
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
            // Multiple Quantity input boxes
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
  const renderFooterContent = () => {
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
          {/* </span> */}
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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 2, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const StandardCustomButton = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          standardPageNumber === 1
            ? null
            : StandardProductList(standardPageNumber - 1);
        }}
        size={"20px"}
        className={standardPageNumber === 1 ? "ArrowIcon2" : "ArrowIcon"}
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          StandardProductList(standardPageNumber + 1);
        }}
        size={"21px"}
        className="LeftArrowIcon"
      />
    </div>
  );
  const IostopeCustomButton = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          isotopePageNumber === 1
            ? null
            : IsotopeProductList(isotopePageNumber - 1);
        }}
        size={"20px"}
        className={isotopePageNumber === 1 ? "ArrowIcon2" : "ArrowIcon"}
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          IsotopeProductList(isotopePageNumber + 1);
        }}
        size={"20px"}
        className="LeftArrowIcon"
      />
    </div>
  );

  const MetabolitesCustomButton = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          metabolitesPageNumber === 1
            ? null
            : MetabolitesProductList(metabolitesPageNumber - 1);
        }}
        size={"20px"}
        className={metabolitesPageNumber === 1 ? "ArrowIcon2" : "ArrowIcon"}
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          MetabolitesProductList(metabolitesPageNumber + 1);
        }}
        size={"20px"}
        className="ArrowIcon"
      />
    </div>
  );

  const StandardProductList = (pageNumber) => {
    let payload = {
      typeRefId: null,
      pageNumber: pageNumber ? pageNumber : 1,
      pageSize: 1,
      //catalogId: "catalogId",
      sortDirection: "",
      sortField: "",
      category: "Working Reference Standard",
    };
    setStatus(true);
    props
      .getProductByCategory(payload)
      .then((res) => {
        const visibleStdCategory = res?.data.result;
        // .filter(
        //     (item) => item.isVisible !== true && item.isDelete === false
        //   );
        setListOfStandardProducts(visibleStdCategory);
        setStandardPageNumber(pageNumber ? pageNumber : 1);
        setStatus(false);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const IsotopeProductList = (pageNumber) => {
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: pageNumber ? pageNumber : 1,
      search: "",
      sortDirection: "",
      sortField: "",
      category: "Stable Isotope Labelled",
    };
    setStatus(true);
    props
      .getProductByCategory(payload)
      .then((res) => {
        const visibleIsoCategory = res?.data.result;
        // .filter(
        //     (item) => item.isVisible !== true && item.isDelete === false
        //   );
        setListOfIsotopeProducts(visibleIsoCategory);
        setIsotopePageNumber(pageNumber ? pageNumber : 1);
        setStatus(false);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const MetabolitesProductList = (pageNumber) => {
    let payload = {
      typeRefId: null,
      pageNumber: pageNumber ? pageNumber : 1,
      pageSize: 1,
      search: "",
      sortDirection: "",
      sortField: "",
      category: "Metabolites",
    };
    setStatus(true);
    props
      .getProductByCategory(payload)
      .then((res) => {
        const visibleMetaCategory = res?.data.result;
        // .filter(
        //   (item) => item.isVisible !== true && item.isDelete === false
        // );
        setStatus(false);
        setListOfMetabolitesProducts(visibleMetaCategory);
        setMetabolitesPageNumber(pageNumber ? pageNumber : 1);
      })
      .catch((error) => {
        setStatus(false);
      });
  };

  useEffect(() => {
    StandardProductList();
    IsotopeProductList();
    MetabolitesProductList();
    return () => {};
  }, []);

  return (
    <>
      <Row>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />

        <Container
          style={{
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <Row className="justify-content-center ">
            {status ? <Loader status={status} /> : null}
            {/* StandardsProduct */}
            <Col sm={12} md={6} lg={4} xl={3}>
              <p className="category_para">Working Standards</p>
              {listOfStandardsProduct && listOfStandardsProduct.length ? (
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlaySpeed={3000}
                  centerMode={false}
                  className=""
                  containerClass="container-padding-bottom"
                  customButtonGroup={<StandardCustomButton />}
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite={false}
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside
                  renderDotsOutside={false}
                  responsive={responsive}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={1}
                >
                  {listOfStandardsProduct && listOfStandardsProduct.length ? (
                    listOfStandardsProduct.map((cardDetails_1, index) => {
                      return (
                        <Card key={index} className="custom-card-category ">
                          <Card.Body>
                            <Card.Title>
                              <span className="titleName">
                                {cardDetails_1?.chemicalName.length > 15
                                  ? `${cardDetails_1.chemicalName.slice(
                                      0,
                                      15
                                    )}...`
                                  : cardDetails_1.chemicalName}
                              </span>
                            </Card.Title>
                            <div className="card-div">
                              {cardDetails_1.productImage ? (
                                <img
                                  src={cardDetails_1.productImage}
                                  alt="Product Image"
                                  className="product-image"
                                />
                              ) : (
                                <span className="titleName">
                                  No Image Found
                                </span>
                              )}
                            </div>
                            <h6 className="text">
                              <span className="titleName card-text">
                                Molecular Formula :{" "}
                                <span className="sub-text card-text">
                                  {cardDetails_1?.molecularFormula.length > 8
                                    ? `${cardDetails_1?.molecularFormula.slice(
                                        0,
                                        8
                                      )}..`
                                    : cardDetails_1?.molecularFormula}
                                </span>
                              </span>
                            </h6>
                            <h6 className="text">
                              <span className="titleName card-text">
                                CAS Number :{" "}
                                <span className="sub-text card-text">
                                  {cardDetails_1?.casNumber
                                    ? cardDetails_1?.casNumber
                                    : " --"}
                                </span>
                              </span>
                            </h6>
                            <Row>
                              <Col>
                                <button
                                  onClick={() => {
                                    navigate("/products/detailpage", {
                                      state: cardDetails_1,
                                    });
                                  }}
                                  className="product-button"
                                >
                                  More Details
                                </button>
                              </Col>
                              <Col>
                                <button
                                  onClick={() => {
                                    handleShowModalStandards(),
                                      setchemName(cardDetails_1.chemicalName);
                                  }}
                                  className="product-button"
                                >
                                  Add to Enquiry
                                </button>
                                <GenericModal
                                  show={showModalStandards}
                                  onHide={handleHideModalStandards}
                                  title={
                                    cardDetails_1?.chemicalName &&
                                    cardDetails_1?.chemicalName.length > 12
                                      ? `${cardDetails_1?.chemicalName.slice(
                                          0,
                                          12
                                        )}...`
                                      : cardDetails_1?.chemicalName
                                  }
                                  subtitle=" CAT Number"
                                  subtitletext={
                                    cardDetails_1?.casNumber
                                      ? cardDetails_1?.casNumber
                                      : " --"
                                  }
                                  body={renderBody()}
                                  child={renderFooterContent()}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      );
                    })
                  ) : (
                    <div>
                      <h1>No Records Found!!</h1>
                    </div>
                  )}
                </Carousel>
              ) : (
                <div className="text-center">
                  <h6>Product Not Found...</h6>
                </div>
              )}
            </Col>
            {/* IsotopeProduct */}
            <Col sm={12} md={6} lg={4} xl={3}>
              <div>
                <p className="category_para">Isotope Labelled</p>
                {listOfIsotopeProduct && listOfIsotopeProduct.length ? (
                  <Carousel
                    additionalTransfrom={0}
                    arrows={false}
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="container-padding-bottom"
                    customButtonGroup={<IostopeCustomButton />}
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite={false}
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside
                    renderDotsOutside={false}
                    responsive={responsive}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                  >
                    {listOfIsotopeProduct && listOfIsotopeProduct.length ? (
                      listOfIsotopeProduct.map((cardDetails_2, index) => {
                        return (
                          <Card className="custom-card-category" key={index}>
                            <Card.Body>
                              <Card.Title>
                                <span className="titleName">
                                  {cardDetails_2?.chemicalName.length > 12
                                    ? `${cardDetails_2.chemicalName.slice(
                                        0,
                                        12
                                      )}...`
                                    : cardDetails_2.chemicalName}
                                </span>
                              </Card.Title>
                              <div className="card-div">
                                {cardDetails_2.productImage ? (
                                  <img
                                    src={cardDetails_2?.productImage}
                                    alt="Product Image"
                                    className="product-image"
                                  />
                                ) : (
                                  <span className="titleName">
                                    No Image Found
                                  </span>
                                )}
                              </div>
                              <h6 className="text">
                                <span className="titleName card-text">
                                  Molecular Formula :{" "}
                                  <span className="sub-text card-text">
                                    {cardDetails_2?.molecularFormula.length > 8
                                      ? `${cardDetails_2?.molecularFormula.slice(
                                          0,
                                          8
                                        )}..`
                                      : cardDetails_2?.molecularFormula}
                                  </span>
                                </span>
                              </h6>
                              <h6 className="text">
                                <span className="titleName  card-text">
                                  CAS Number :{" "}
                                  <span className="sub-text card-text">
                                    {cardDetails_2.casNumber
                                      ? cardDetails_2.casNumber
                                      : " --"}
                                  </span>
                                </span>
                              </h6>
                              <Row>
                                <Col>
                                  <button
                                    onClick={() => {
                                      navigate("/products/detailpage", {
                                        state: cardDetails_2,
                                      });
                                    }}
                                    className="product-button"
                                  >
                                    More Details
                                  </button>
                                </Col>
                                <Col>
                                  <Col>
                                    <button
                                      onClick={() => {
                                        handleShowModalIsotope(),
                                          setchemName(
                                            cardDetails_2.chemicalName
                                          );
                                      }}
                                      className="product-button"
                                    >
                                      Add to Enquiry
                                    </button>
                                    <GenericModal
                                      show={showModalIsotope}
                                      onHide={handleHideModalIsotope}
                                      title={
                                        cardDetails_2?.chemicalName &&
                                        cardDetails_2?.chemicalName.length > 12
                                          ? `${cardDetails_2?.chemicalName.slice(
                                              0,
                                              12
                                            )}...`
                                          : cardDetails_2?.chemicalName
                                      }
                                      subtitle=" CAT Number"
                                      subtitletext={
                                        cardDetails_2.casNumber
                                          ? cardDetails_2.casNumber
                                          : " --"
                                      }
                                      body={renderBody()}
                                      child={renderFooterContent()}
                                    />
                                  </Col>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        );
                      })
                    ) : (
                      <div>
                        <h1>No Records Found!!</h1>
                      </div>
                    )}
                  </Carousel>
                ) : (
                  <div className="text-center">
                    <h6>Product Not Found...</h6>
                  </div>
                )}
              </div>
            </Col>
            {/* MetablolitesProduct */}
            <Col sm={12} md={6} lg={4} xl={3}>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "27px",
                  marginTop: "-2px",
                }}
              >
                Metabolites
              </p>
              {listOfMetablolitesProduct && listOfMetablolitesProduct.length ? (
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlaySpeed={3000}
                  centerMode={false}
                  className=""
                  containerClass="container-padding-bottom"
                  customButtonGroup={<MetabolitesCustomButton />}
                  dotListClass=""
                  draggable
                  focusOnSelect={false}
                  infinite={false}
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside
                  renderDotsOutside={false}
                  responsive={responsive}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={1}
                >
                  {listOfMetablolitesProduct &&
                  listOfMetablolitesProduct.length ? (
                    listOfMetablolitesProduct.map((cardDetails_3, index) => {
                      return (
                        <Card key={index} className="custom-card-category">
                          <Card.Body>
                            <Card.Title>
                              <span className="titleName">
                                {cardDetails_3?.chemicalName.length > 12
                                  ? `${cardDetails_3.chemicalName.slice(
                                      0,
                                      12
                                    )}...`
                                  : cardDetails_3.chemicalName}
                              </span>
                            </Card.Title>
                            <div className="card-div">
                              {/* <span className="titleName"> */}
                              {cardDetails_3.productImage ? (
                                <img
                                  src={cardDetails_3?.productImage}
                                  alt="Product Image"
                                  className="product-image"
                                />
                              ) : (
                                <span className="titleName">
                                  No Image Found
                                </span>
                              )}
                            </div>
                            <h6 className="text">
                              <span className="titleName  card-text">
                                Molecular Formula :{" "}
                                <span className="sub-text card-text">
                                  {cardDetails_3?.molecularFormula.length > 8
                                    ? `${cardDetails_3?.molecularFormula.slice(
                                        0,
                                        8
                                      )}..`
                                    : cardDetails_3?.molecularFormula}
                                </span>
                              </span>
                            </h6>
                            <h6 className="text  card-text">
                              CAS Number :{" "}
                              <span className="sub-text card-text">
                                {cardDetails_3.casNumber
                                  ? cardDetails_3.casNumber
                                  : "--"}
                              </span>
                            </h6>
                            <Row>
                              <Col>
                                <button
                                  onClick={() => {
                                    navigate("/products/detailpage", {
                                      state: cardDetails_3,
                                    });
                                  }}
                                  className="product-button"
                                >
                                  More Details
                                </button>
                              </Col>
                              <Col>
                                <Col>
                                  <button
                                    onClick={() => {
                                      handleShowModalMetabolites(),
                                        setchemName(cardDetails_3.chemicalName);
                                    }}
                                    className="product-button"
                                  >
                                    Add to Enquiry
                                  </button>
                                  <GenericModal
                                    show={showModalMetabolites}
                                    onHide={handleHideModalMetabolites}
                                    title={
                                      cardDetails_3?.chemicalName &&
                                      cardDetails_3?.chemicalName.length > 12
                                        ? `${cardDetails_3?.chemicalName.slice(
                                            0,
                                            12
                                          )}...`
                                        : cardDetails_3?.chemicalName
                                    }
                                    subtitle=" CAT Number"
                                    subtitletext={
                                      cardDetails_3.casNumber
                                        ? cardDetails_3.casNumber
                                        : " --"
                                    }
                                    body={renderBody()}
                                    child={renderFooterContent()}
                                  />
                                </Col>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      );
                    })
                  ) : (
                    <div>
                      <h1>No Records Found!!</h1>
                    </div>
                  )}
                </Carousel>
              ) : (
                <div className="text-center">
                  <h6>Product Not Found...</h6>
                </div>
              )}
            </Col>
          </Row>
        </Container>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
      </Row>
    </>
  );
};

const mapDispatchToProps = {
  getProductByCategory: (payloadData) => getProductByCategory(payloadData),
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
};
const mapStateToProps = ({ countReducer: { enquireListData } }) => ({
  enquireListData,
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryComponent);
