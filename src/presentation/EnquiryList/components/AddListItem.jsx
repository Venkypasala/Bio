import React, { useState, useEffect } from "react";
import { Col, Row} from "react-bootstrap";
import Select from "react-select";
import { getListOfFilteredProduct, searchProduct } from "../../../application/services/actions/auth";
import { connect } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { updateNotificationCount } from "../../../application/services/actions/count";
import { toast } from "react-toastify";
const ValidationSchema = yup.object().shape({
  compound: yup.object().nullable().required("Please select an item.."),
  mg: yup
    .string()
    .matches(/^\S*$/, "Space is not allowed")
    .max(4, "Too Long!")
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{4})*)|\d+)?(\.\d{1,2})?$/,
      "Only number allowed"
    )
    .typeError("That doesn't look like a phone number")
    .nullable()
    .required("Please Enter Quantity."),
  showEdit: yup.boolean().default(false),
  readOnly: yup.boolean().default(true),
});
function AddListItem(props) {
  const { setEnquiryList, enquiryList } =
    props;
  const [data, setData] = useState({
    compound: "",
    mg: "",
    isInterMediate: false,
    showEdit: false,
    readOnly: true,
  });
 
  const [options, setOptions] = useState([]);
  const handleInputChange = (e, key) => {
    const tempData = {
      ...data,
    };
    tempData[key] = e;
   
    
    if (e && e.length >= 3) {

        postEnquiryList(e);
    }
    setFieldValue(key, e);
    setData(tempData);
  };

  const handleSelectChange = (selectedOption) => {
    handleInputChange(selectedOption, 'compound');
  };
  const formHandler = (e) => {
    setData({
      ...data,
    });

    const tempData = [...enquiryList];

    const existingItemIndex = tempData.findIndex(
      (el) =>
        el?.compound?.id === data?.compound?.id &&
        parseFloat(el?.mg) === parseFloat(data?.mg)
    );

    if (existingItemIndex === -1) {
      tempData.push(data);
      setEnquiryList(tempData);
      props.updateNotification(tempData);
      handleReset();
    } else {
      toast.error(
        "This chemical and quantity combination is already in the list.",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        }
      );
    }
  };

  const { handleSubmit, setFieldValue, handleReset, values, touched, errors } =
    useFormik({
      initialValues: {
        compound: "",
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
    const productListApi = () => {
      let payload = {
        pageNumber: 1,
        pageSize: 100,
        search: "",
        sortField: "",
        sortDirection: "",
        category: "",
      };
      props
      .getListOfProduct(payload)
        .then((res) => {
          const Result = res?.data?.result.map((item) => {
            return {
              id: item?.id,
              value: item?.chemicalName,
              label: item?.chemicalName,
            };
          });
          setOptions(Result);
        })
        .catch((error) => {
        });
    };
  const postEnquiryList = (value) => {
    let payload = {
      pageNumber: 1,
      pageSize: 5,
      search: value,
      sortField: "",
      sortDirection: "",
      category: "",
    };
    props
    .searchApi(payload)
      .then((res) => {
        const Result = res?.data?.result
        .map((item) => {
          return {
            id: item?.id,
            value: item?.chemicalName,
            label: item?.chemicalName,
          };
        });
   
        setOptions(Result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    productListApi();
    // postEnquiryList();
  }, []);

  return (
    <Row className="align-items-center justify-content-center bg-light py-3 px-1 ms-auto rounded-3">
      <Col xs="12">
        <Row className="w-100 align-items-center justify-content-between g-2">
          <Col xs={12} sm={12} md={12} lg={4}>
            <Select
              isClearable
              isSearchable = {true}
              options={options}
              placeholder={<div className="select-placeholder-text">Search Compound</div>} 
              classNamePrefix="react-select"
              onInputChange={
                
                handleInputChange}
                
                onChange={handleSelectChange}
              
              value={values.compound}
            />
            {errors.compound && touched.compound ? (
              <div className="errorMessage">{errors.compound}</div>
            ) : null}
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <input
              type="text"
              value={values.mg}
              className="quality-box align-items-center justify-content-center w-100"
              placeholder="Quantity in Mg"
              onChange={(e) => handleInputChange(e.target.value, "mg")}
            />

            {errors.mg && touched.mg ? (
              <div className="errorMessage">{errors.mg}</div>
            ) : null}
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="checkbox-container">
                <input
                  className="check-input"
                  type="checkbox"
                  onChange={(e) => {
                    handleInputChange(e.target.checked, "isInterMediate");
                  }}
                />
                <label className="check-input-label Draft-style ms-1">
                  Draft COA
                </label>
              </div>

              <button
                type={"submit"}
                className="add-button"
                onClick={(e) => handleSubmit(e)}
              >
                +Add
              </button>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const mapStateToProps = ({ authReducer: { getProductList } }) => ({
  getProductList,
});
const mapDispatchToProps = {
  getListOfProduct:(payloadData) => getListOfFilteredProduct(payloadData),
  searchApi: (payloadData) => searchProduct(payloadData),
  updateNotification: (payloadData) => updateNotificationCount(payloadData),
};
export default connect(mapStateToProps, mapDispatchToProps)(AddListItem);
