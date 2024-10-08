import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { MdAdd } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { useFormik } from "formik";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Select, { components } from "react-select";
import {
  getListOfProduct,
  imgUpload,
  getLastProduct,
  createProduct,
  updateProduct,
  productCategory,
  getCategoryList,
} from "../../application/services/actions/auth";
import { connect } from "react-redux";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../infrastructure/components/Loader/Loader";
import AdminHeaderComponent from "../AdminHeader/AdminHeaderComponent";

window.Buffer = window.Buffer || require("buffer").Buffer;
const validationSchema = yup.object({
  ProductName: yup.string().nullable().required("Product Name is required."),
  Synonym: yup.string().nullable().required("Synonym is required."),
  MolecularFormula: yup
    .string()
    .nullable()
    .required("Molecular Formula is required."),
  MolecularWeight: yup
    .string()
    .nullable()
    .required("Molecular Weight is required."),
  CAS: yup.string().nullable().required("CAS Number is required"),

  InventoryStatus: yup
    .string()
    .nullable()
    .required("Inventory Status is required."),
  // Category: yup.string().nullable().required("Category is required."),
});

const S3_BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
const REGION = process.env.REACT_APP_REGION;
const AWS_ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_ID;
const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

function AddNewProductComponent(props) {
  const location = useLocation();
  const productInformation = location?.state?.data
    ? JSON.parse(location?.state?.data?.productDetails)
    : {};
  const [selectedImage, setSelectedImage] = useState(
    location?.state?.data?.productImage
  );
  const [fileImage, setFileImage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isimageSelected, setIsimageSelected] = useState(false);
  const [getProdId, setGetProdId] = useState(null);
  const [editImage, setEditImage] = useState(
    location?.state?.screen === "Add New" || location?.state?.screen === "Edit"
      ? false
      : true
  );
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showLastProduct, setshowLastProduct] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [isEditProductName, setIsEditProductName] = useState(
    location?.state?.screen === "Add New" || location?.state?.screen === "Edit"
      ? false
      : true
  );
  const [isEditInventoryInformation, setIsEditInventoryInformation] = useState(
    location?.state?.screen === "Add New" || location?.state?.screen === "Edit"
      ? false
      : true
  );
  const [isEditWorkingStandard, setIsEditWorkingStandard] = useState(
    location?.state?.screen === "Add New" || location?.state?.screen === "Edit"
      ? false
      : true
  );
  const [allProductList, setAllProductList] = useState([]);
  const [status, setStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isAdmine, setIsadmin] = useState(true);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          {props.label}
        </components.Option>
      </div>
    );
  };

  const fetchCategoryByProduct = (id) => {
    const payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 100,
      sortDirection: "",
      sortField: "",
      productId: id,
      categoryName: "",
    };
    props
      .categoryByProduct(payload)
      .then((res) => {
        setAllProductList([]);
        setCategoryData(res?.data?.result);
      })
      .catch((err) => {});
  };
  const catagoryListApi = () => {
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 500,
      search: "",
      sortDirection: "",
      sortField: "",
      category: "",
    };

    setStatus(true);
    props
      .getCategoryList(payload)
      .then((res) => {
        let selectedVisibility = res?.data.result.filter(
          (item) => item.isVisible === true
        );

        setStatus(false);
        setSelectedCategory(selectedVisibility);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const categoryNames = categoryData.map((category) => category.categoryName);
  const { values, touched, errors, handleChange, handleSubmit, setValues } =
    useFormik({
      initialValues: {
        id: selectedProduct?.id
          ? selectedProduct?.id
          : location?.state?.data?.id
          ? location?.state?.data?.id
          : "",
        ProductName: selectedProduct?.chemicalName
          ? selectedProduct?.chemicalName
          : location?.state?.data?.chemicalName
          ? location?.state?.data?.chemicalName
          : "",
        Category:
          selectedProductDetails?.category || selectedProductDetails?.Category
            ? selectedProductDetails?.category ||
              selectedProductDetails?.Category
            : categoryNames.toString()
            ? categoryNames.toString()
            : "",
        Synonym:
          selectedProductDetails?.synonyms || selectedProductDetails?.Synonyms
            ? selectedProductDetails?.synonyms ||
              selectedProductDetails?.Synonyms
            : productInformation?.Synonyms || productInformation?.synonyms
            ? productInformation?.Synonyms || productInformation?.synonyms
            : "",
        CAT:
          location?.state?.screen === "Add New"
            ? showLastProduct
            : selectedProduct?.catId
            ? selectedProduct?.catId
            : location?.state?.data?.catId
            ? location?.state?.data?.catId
            : "",
        InventoryStatus:
          location?.state?.screen === "Add New" ? "" : "In-Stock",
        CAS: selectedProduct?.casNumber
          ? selectedProduct?.casNumber
          : location?.state?.data?.casNumber
          ? location?.state?.data?.casNumber
          : "",
        MolecularFormula: selectedProduct?.molecularFormula
          ? selectedProduct?.molecularFormula
          : location?.state?.data?.molecularFormula
          ? location?.state?.data?.molecularFormula
          : "",
        MolecularWeight: selectedProduct?.molecularWeight
          ? selectedProduct?.molecularWeight
          : location?.state?.data?.molecularWeight
          ? location?.state?.data?.molecularWeight
          : "",
        Appearance: selectedProductDetails?.appearance
          ? selectedProductDetails?.appearance
          : productInformation?.appearance
          ? productInformation?.appearance
          : "",
        Purity: selectedProductDetails?.purity
          ? selectedProductDetails?.purity
          : productInformation?.purity
          ? productInformation?.purity
          : "",
        Storage: selectedProductDetails?.storage
          ? selectedProductDetails?.storage
          : productInformation?.storage
          ? productInformation?.storage
          : "",
        Solubilty: selectedProductDetails?.solubility
          ? selectedProductDetails?.solubility
          : productInformation?.solubility
          ? productInformation?.solubility
          : "",
      },
      enableReinitialize: true,
      validateOnBlur: true,
      validateOnChange: true,
      validateOnMount: true,
      validationSchema: validationSchema,
      onSubmit: () => toggleModal(),
    });

  const getLastProductID = () => {
    props
      .getLastProductID()
      .then((res) => {
        setStatus(false);
        setShow(true);
        setshowLastProduct(res?.data);
      })
      .catch((error) => {
        setStatus(false);
        setShow(false);
      });
  };
  const toggleModal = () => {
    setShowUpdate(!showUpdate);
  };

  const productImageUpload = (reader, id) => {
    const payload = {
      productId: id,
      productImage: reader,
    };
    props
      .uploadProductImage(payload,accessToken)
      .then((res) => {
        setIsimageSelected((p) => !p);
      })
      .catch((error) => {});
  };

  const imageUpload = async (file, id) => {
    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: "prod-img/" + file.name,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const objectUrl = `https://${S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/prod-img/${file.name}`;
      setFileUrl(objectUrl);
      selectedImage ? productImageUpload(objectUrl, id) : null;
    } catch (error) {
      toast.error("Image upload failed, Try Again", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  const formHandler = () => {
    const payload = {
      id: selectedProduct?.id
        ? selectedProduct?.id
        : location?.state?.data?.id
        ? location?.state?.data?.id
        : null,
      catId: values.CAT ? values.CAT : "",
      casNumber: values.CAS ? values.CAS : "",
      molecularFormula: values.MolecularFormula ? values.MolecularFormula : "",
      molecularWeight: values.MolecularWeight ? values.MolecularWeight : "",
      chemicalName: values.ProductName ? values.ProductName : "",
      synonyms: values.Synonym ? values.Synonym : "",
      category: values.Category ? values.Category : "",
      InventoryStatus: values.InventoryStatus ? values.InventoryStatus : "",
      addToLatest: true,
      productDetails: {
        catId: values.CAT ? values.CAT : "",
        casNumber: values.CAS ? values.CAS : "",
        molecularFormula: values.MolecularFormula
          ? values.MolecularFormula
          : "",
        molecularWeight: values.MolecularWeight ? values.MolecularWeight : "",
        chemicalName: values.ProductName ? values.ProductName : "",
        synonyms: values.Synonym ? values.Synonym : "",
        productImage: selectedImage ? selectedImage : "",
        category: values.Category ? values.Category : "",
        Applications: "",
        References: "",
        Purity: values.Purity ? values.Purity : "",
        Storage: values.Storage ? values.Storage : "",
        Solubility: values.Solubilty ? values.Solubilty : "",
      },
    };
    setShowUpdate(!showUpdate);
    setStatus(true);
    {
      location?.state?.screen === "Add New"
        ? props
            .postNewProduct(payload, accessToken)
            .then((res) => {
              setGetProdId(res?.data?.id);
              if (!isImageUploaded && fileImage) {
                imageUpload(fileImage, res?.data?.id);
                setIsImageUploaded(true);
              }
              setStatus(false);
              setShowUpdateConfirm(!showUpdateConfirm)
                ? setShowUpdate(true)
                : setShowUpdate(false);
            })
            .catch((error) => {
              setStatus(false);
              toast.error(
                error?.status === 400 ? error?.reason : "Something went wrong",
                {
                  position: toast.POSITION.BOTTOM_RIGHT,
                }
              );
            })
        : props
            .postUpdateProduct(payload,accessToken)
            .then((res) => {
              setGetProdId(location?.state?.data?.id);
              if (!isImageUploaded && fileImage) {
                imageUpload(fileImage, location?.state?.data?.id);
                setIsImageUploaded(true);
              }

              setStatus(false);
              setShowUpdateConfirm(!showUpdateConfirm)
                ? setShowUpdate(true)
                : setShowUpdate(false);
            })
            .catch((error) => {
              setStatus(false);
              toast.error(
                error?.status === 400 ? error?.reason : "Something went wrong",
                {
                  position: toast.POSITION.BOTTOM_RIGHT,
                }
              );
            });
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (getProdId && fileUrl) {
      setIsImageUploaded(false);
    }
  }, [getProdId, fileUrl]);

  useEffect(() => {
    getLastProductID();
    catagoryListApi();
    fetchCategoryByProduct(location?.state?.data?.id);
  }, []);
  // custome style for drop-down
  const customStyles = {
    control: (provided) => ({
      ...provided,
      paddingLeft: "10px",
      paddingTop: "2px",
      paddingBottom: "2px",
      border: "1px solid #fff",
      backgroundColor: "white",
      borderRadius: "12px",
      width: "120%",
      // border: "1px solid #f2f2f2",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "black",
      paddingLeft: "50px",
    }),

    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    option: (styles, state) => ({
      ...styles,
      "&:hover": {
        backgroundColor: "#f6913a",
        color: "black",
      },
      backgroundColor: state.isSelected ? "#f6913a" : styles.backgroundColo,
      color: "black",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };
  // maption drop-down api
  const options = selectedCategory?.map((item) => ({
    value: item?.id,
    label: item?.categoryName,
  }));
  const handleSelectChange = (selectedOptions) => {
    const selectedCategoryValues = selectedOptions.map(
      (option) => option.label
    );

    setValues({
      ...values,
      Category: selectedCategoryValues.join(","),
    });
  };

  // Initialize the selected categories based on values.Category
  const initialSelectedCategories = values.Category.split(",");
  const selectedCategoryOptions = options.filter((option) =>
    initialSelectedCategories.includes(option.label)
  );

  return (
    <Container fluid className="main-div-add" sm={12} md={12} lg={12}>
      {status ? <Loader status={status} /> : null}
      <AdminHeaderComponent />
      <Row style={{ backgroundColor: "#efefef" }} sm={8} md={8} lg={8}>
        <Modal
          show={showUpdate}
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
              {location?.state?.screen === "Add New"
                ? "You Want to create the product?"
                : "You Want to update the product?"}
            </p>
            <div>
              <h6></h6>
            </div>
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
                onClick={() => {
                  formHandler();
                }}
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
                onClick={() => setShowUpdate(false)}
              >
                NO
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={showUpdateConfirm}
          backdrop="static"
          size="sm"
          centered
          className="p-4"
        >
          <Modal.Body className="m-3">
            <h3
              style={{
                textAlign: "center",
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
              Updated Successfully
            </p>

            <div className="d-flex justify-content-between align-items-center mx-5">
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
                onClick={() => {
                  setShowUpdateConfirm(false);
                  navigate("/AdminDashboard");
                }}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
        <Col lg={10} sm={12} md={12}>
          <Row sm={10} md={10} lg={12}>
            <div className="d-flex d-row">
              <input
                id="ProductName"
                name="ProductName"
                type="text"
                style={{
                  color: "#a3238e",
                  fontSize: "25px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                className="prodname-box mt-3"
                placeholder="Add New Product Name"
                disabled={isEditProductName}
                value={values.ProductName}
                onChange={handleChange("ProductName")}
                autoFocus
              />
            </div>
            {errors.ProductName && touched.ProductName ? (
              <div className="errorMessage" style={{ marginLeft: "5rem" }}>
                {errors.ProductName}
              </div>
            ) : null}
          </Row>
          <Row sm={8} md={8} lg={10}>
            <Col lg={6} sm={12}>
              <Row className="img-upload">
                {" "}
                <h6 style={{ paddingLeft: "1rem", paddingTop: "1rem" }}>
                  Molecular Diagram
                </h6>
                {selectedImage ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={selectedImage}
                        alt="Preview"
                        style={{ width: "50%", height: "7rem" }}
                      />
                    </div>
                  </div>
                ) : (
                  <BsUpload size={55} className="upload-img" />
                )}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ position: "relative" }}
                />
              </Row>
              <Row className="align-items-center">
                <h3 className="mt-5 " style={{ fontWeight: "bold" }}>
                  Inventory Information
                </h3>
              </Row>
              <Row className="align-items-center">
                <Col>
                  <div className="mt-3">
                    <h6>CAT Number:</h6>
                  </div>
                </Col>

                <Col>
                  {isEditInventoryInformation ? (
                    <h6 style={{ marginTop: "1.5rem" }}>
                      {values.CAT || "--"}
                    </h6>
                  ) : (
                    <input
                      id="CAT"
                      name="CAT"
                      type="text"
                      onChange={handleChange("CAT")}
                      value={values.CAT}
                      className="txt-box-std mt-4"
                      disabled={true}
                    />
                  )}
                </Col>
              </Row>

              <Row className="align-items-center">
                <Col>
                  <div className="mt-3">
                    <h6>Inventory Status:</h6>
                  </div>
                </Col>

                <Col>
                  {isEditInventoryInformation ? (
                    <h6 style={{ marginTop: "1.4rem" }}>
                      {values.InventoryStatus || "--"}
                    </h6>
                  ) : (
                    <input
                      id="InventoryStatus"
                      name="InventoryStatus"
                      type="text"
                      onChange={handleChange("InventoryStatus")}
                      value={values.InventoryStatus}
                      placeholder="Enter the Inventory Status"
                      disabled={isEditInventoryInformation}
                      className="txt-box-std mt-4"
                    />
                  )}
                  {errors.InventoryStatus && touched.InventoryStatus ? (
                    <div className="errorMessage">{errors.InventoryStatus}</div>
                  ) : null}
                </Col>
              </Row>
            </Col>
            <Col lg={6} sm={12}>
              <Row>
                <h3 className="txt-style mt-4">Product Details</h3>
                <Col>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>Category:</h6>
                      </div>
                    </Col>
                    <Col
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      {isEditWorkingStandard ? (
                        <h6>{values.Category || "--"}</h6>
                      ) : (
                        <>
                          <Select
                            isMulti
                            options={options}
                            components={{ Option }}
                            placeholder="Select Category"
                            onChange={handleSelectChange}
                            styles={customStyles}
                            value={selectedCategoryOptions}
                          />
                        </>
                      )}
                      <OverlayTrigger
                        placement="top"
                        className="bg-danger"
                        overlay={
                          <Tooltip id="categoryTooltip">
                            Add new category
                          </Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className="addCat-btn"
                          onClick={() => {
                            navigate("/AdminDashboard/category");
                          }}
                        >
                          {" "}
                          <MdAdd fontSize={"27px"} fontWeight={"bold"} />
                        </button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>Synonyms:</h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.Synonym || "--"}</h6>
                      ) : (
                        <input
                          id="Synonym"
                          name="Synonym"
                          type="textarea"
                          onChange={handleChange("Synonym")}
                          value={values.Synonym}
                          placeholder="Enter the Synonyms"
                          className="txt-box-std mt-3"
                          disabled={isEditWorkingStandard}
                        />
                      )}
                      {errors.Synonym && touched.Synonym ? (
                        <div className="errorMessage">{errors.Synonym}</div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>CAS Number:</h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.CAS || "--"}</h6>
                      ) : (
                        <input
                          id="CAS"
                          name="CAS"
                          type="text"
                          onChange={handleChange("CAS")}
                          value={values.CAS}
                          placeholder="Enter the CAS Number"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                      {errors.CAS && touched.CAS ? (
                        <div className="errorMessage">{errors.CAS}</div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>
                          Molecular Formula:
                        </h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.MolecularFormula || "--"}</h6>
                      ) : (
                        <input
                          id="MolecularFormula"
                          name="MolecularFormula"
                          type="text"
                          onChange={handleChange("MolecularFormula")}
                          value={values.MolecularFormula}
                          placeholder="Enter the Molecular Formula"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                      {errors.MolecularFormula && touched.MolecularFormula ? (
                        <div className="errorMessage">
                          {errors.MolecularFormula}
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>
                          Molecular Weight:
                        </h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.MolecularWeight || "--"}</h6>
                      ) : (
                        <input
                          id="MolecularWeight"
                          name="MolecularWeight"
                          type="text"
                          onChange={handleChange("MolecularWeight")}
                          value={values.MolecularWeight}
                          placeholder="Enter the Molecular Weight"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                      {errors.MolecularWeight && touched.MolecularWeight ? (
                        <div className="errorMessage">
                          {errors.MolecularWeight}
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>Appearance:</h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.Appearance || "--"}</h6>
                      ) : (
                        <input
                          id="Appearance"
                          name="Appearance"
                          type="text"
                          onChange={handleChange("Appearance")}
                          value={values.Appearance}
                          placeholder="Enter the Appearance"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>Purity:</h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.Purity || "--"}</h6>
                      ) : (
                        <input
                          id="Purity"
                          name="Purity"
                          type="text"
                          onChange={handleChange("Purity")}
                          value={values.Purity}
                          placeholder="Enter the Purity"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>
                          Storage Condition:
                        </h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.Storage || "--"}</h6>
                      ) : (
                        <input
                          id="Storage"
                          name="Storage"
                          type="text"
                          onChange={handleChange("Storage")}
                          value={values.Storage}
                          placeholder="Enter the Storage Condition"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col>
                      <div className="mt-3">
                        <h6 style={{ fontWeight: "bold" }}>Solubility:</h6>
                      </div>
                    </Col>
                    <Col style={{ marginTop: "12px" }}>
                      {isEditWorkingStandard ? (
                        <h6>{values.Solubilty || "--"}</h6>
                      ) : (
                        <input
                          id="Solubility"
                          name="Solubility"
                          type="text"
                          onChange={handleChange("Solubility")}
                          value={values.Solubilty}
                          placeholder="Enter the Solubility"
                          className="txt-box-std mt-4"
                          disabled={isEditWorkingStandard}
                          style={{
                            borderRadius: "10px",
                            height: "2rem",
                            border: "transparent",
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row sm={4} lg={12} className="d-flex justify-content-center">
            <Row style={{ justifyContent: "center", alignItems: "center" }}>
              <Col>
                <button
                  className="footer-btn mx-3 mt-4 text-center"
                  onClick={
                    isEditInventoryInformation ||
                    isEditWorkingStandard ||
                    isEditProductName
                      ? () => {
                          setIsEditProductName(false),
                            setIsEditInventoryInformation(false),
                            setIsEditWorkingStandard(false);
                        }
                      : handleSubmit || setShowUpdateConfirm(true)
                  }
                >
                  {location?.state?.screen === "Add New"
                    ? "Create"
                    : !isEditInventoryInformation ||
                      !isEditWorkingStandard ||
                      !isEditProductName
                    ? "Update"
                    : "Edit"}
                </button>
              </Col>
            </Row>

            {!isEditInventoryInformation ||
            !isEditWorkingStandard ||
            !isEditProductName ? (
              <Row style={{ justifyContent: "center", alignItems: "center" }}>
                <Col>
                  <button
                    className="footer-btn mx-3 mt-4 text-center"
                    onClick={() => {
                      navigate("/AdminDashboard");
                    }}
                  >
                    Cancel
                  </button>
                </Col>
              </Row>
            ) : null}
          </Row>
        </Col>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
      </Row>
    </Container>
  );
}

const mapStateToProps = ({ authReducer: { getProductList } }) => ({
  getProductList,
});
const mapDispatchToProps = {
  getListOfProduct: (payloadData) => getListOfProduct(payloadData),
  uploadProductImage: (image, id,accessToken) => imgUpload(image, id,accessToken),
  getLastProductID: () => getLastProduct(),
  postNewProduct: (payloadData, accessToken) =>
  createProduct(payloadData, accessToken),
  categoryByProduct: (payloadData) => productCategory(payloadData),
  postUpdateProduct: (payloadData,accessToken) => updateProduct(payloadData,accessToken),
  getCategoryList: (payloadData) => getCategoryList(payloadData),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewProductComponent);
