import React from "react";
import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { IoIosAdd, IoMdAddCircle } from "react-icons/io";
import GenericModal from "../../../presentation/Products/GenericModal";
import * as yup from "yup";
import { updateNotificationCount } from "../../../application/services/actions/count";
import { connect } from "react-redux";
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

const Productcard = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSingleQuantity, setIsSingleQuantity] = useState(true);

  const [isMultipleQuantity, setIsMultipleQuantity] = useState(false);
  const [inputBoxes, setInputBoxes] = useState([""]);
  const { data } = props;

  let navigate = useNavigate();
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const formHandler = () => {
    const tempData = [...props.enquireListData];
    let compoundDetails;

    if (isSingleQuantity) {
      compoundDetails = {
        compound: {
          id: data?.id,
          value: data?.chemicalName,
          label: data?.chemicalName,
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
        return; // Do not proceed with adding the duplicate quantity
      }
    } else {
      const newCompoundDetails = values.mg.map((mgValue) => ({
        compound: {
          id: data?.id,
          value: data?.chemicalName,
          label: data?.chemicalName,
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
        id: data?.id,
        value: data?.chemicalName,
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
  return (
    <div>
      <Row>
        <Col sm={12} lg={12}>
          <Card className="custom-card mt-4">
            <Card.Body>
              <Card.Title>
                <span className="titleName">
                  {data?.chemicalName ? data.chemicalName : " --"}
                </span>
              </Card.Title>
              <div className="card-div">
                {data.productImage ? (
                  <img
                    className="product-image"
                    src={data.productImage}
                    alt="Product Image"
                  />
                ) : (
                  <span>No Image Available</span>
                )}
              </div>
              <div className="text-center">
                <h6 className="text card-text">
                  Molecular Formula :{" "}
                  <span className="sub-text card-text">
                    {data.molecularFormula.length > 8
                      ? `${data.molecularFormula.slice(0, 8)}..`
                      : data.molecularFormula}
                  </span>
                </h6>
                <h6 className="text card-text">
                  CAS Number :
                  <span className="sub-text card-text">
                    {" "}
                    {data.casNumber ? data.casNumber : " --"}
                  </span>
                </h6>
              </div>
              <Row className="text-center">
                <Col>
                  <button
                    className="product-button"
                    onClick={() => {
                      navigate("/products/detailpage", {
                        state: {
                          productDetail: data,
                        },
                      });
                    }}
                  >
                    More Details
                  </button>
                </Col>
                <Col>
                  <button onClick={handleShowModal} className="product-button">
                    Add to Enquiry
                  </button>
                  <GenericModal
                    show={showModal}
                    onHide={handleHideModal}
                    title={
                      data?.chemicalName
                        ? data.chemicalName.slice(0, 15)
                        : " --"
                    }
                    subtitle=" CAT Number"
                    subtitletext={data.casNumber ? data.casNumber : " --"}
                    body={renderBody()}
                    confirmText="Confirm"
                    child={renderFooterContent()}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
const mapStateToProps = ({ countReducer: { enquireListData } }) => ({
  enquireListData,
});
const mapDispatchToProps = {
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
};
export default connect(mapStateToProps, mapDispatchToProps)(Productcard);
