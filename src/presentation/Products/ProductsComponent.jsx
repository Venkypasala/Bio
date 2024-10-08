import React, { useEffect, useState } from "react";
import HeaderComponent from "../Header/HeaderComponent";
import FinalBarComponent from "../FinalBar/FinalBarComponent";
import { IoFilterSharp } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { Container, Row, Col, Modal } from "react-bootstrap";
import Productcard from "../../infrastructure/components/ProductCard/Productcard";
import { getListOfFilteredProduct } from "../../application/services/actions/auth";
import { getProductByCategory } from "../../application/services/actions/auth";
import { getFilteredCategoryList } from "../../application/services/actions/auth";
import { getRelatedProductList } from "../../application/services/actions/auth";
import { connect } from "react-redux";
import CategoryComponent from "./CategoryComponent";
import { useLocation } from "react-router-dom";
import Loader from "../../infrastructure/components/Loader/Loader";
import "./navstlye.scss";
export const ProductsComponent = (props) => {
  const location = useLocation();
  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedVisibilityRows, setSelectedVisibilityRows] = useState([]);
  const [_, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("CategoryName");

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
  const catagoryList = () => {
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 10,
      search: "",
      sortDirection: "",
      sortField: "",
      category: location?.state?.catagoryName
        ? location?.state?.catagoryName
        : "",
    };

    setStatus(true);
    props
      .getCategoryList(payload)
      .then((res) => {
        setStatus(false);
        const visibleCategory = res?.data.result;

        setSelectedVisibilityRows(visibleCategory);

        setCategoryList(res?.data?.result || []);
      })
      .catch((error) => {
        setStatus(false);
      });
  };

  const productListApi = () => {
    let payload = {
      pageNumber: 1,
      pageSize: 6,
      search: "",
      sortField: "",
      sortDirection: "",
      category: "",
    };
    setStatus(true);
    props
      .getListOfProduct(payload)
      .then((res) => {
        setStatus(false);
        const slicedProductList = res?.data?.result;
        setProductList(slicedProductList);
      })
      .catch((error) => {
        setStatus(false);
      });
  };

  const ProductByCatagory = (catagory) => {
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 120,
      search: "",
      sortDirection: "",
      sortField: "",
      category: catagory ? catagory : "Standards",
    };

    setStatus(true);
    props
      .getProductByCategory(payload)
      .then((res) => {
        const visibleCategory = res?.data.result.filter(
          (item) => item.isVisible !== true
        );
        const slicedProductList = visibleCategory.slice(0, 6);
        setStatus(false);
        setProductList(slicedProductList);
      })
      .catch((error) => {
        setStatus(false);
      });
  };

  useEffect(() => {
    productListApi();
    catagoryList();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    return () => {};
  }, []);

  const handleDisplay = () => setDisplay(false);
  const handleClose = () => setShow(false);

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };

  return (
    <Container fluid className="main-product">
      {status ? <Loader status={status} /> : null}
      <Row className="w-100">
        <Col
          className="navbar-section text-end"
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
      {/* categry-first-components and filter-bar*/}
      <Row>
        <Col
          sm={0}
          md={0}
          lg={2}
          style={{
            backgroundColor: "#efefef",
          }}
        ></Col>
        <Col
          sm={12}
          md={12}
          lg={8}
          style={{
            backgroundColor: "#efefef",
          }}
        >
          <Row className="section2-product align-items-center">
            <Col sm={12} md={12} lg={12}>
              <Modal
                show={display}
                onHide={() => handleDisplay()}
                size="sm"
                centered
                className="p-4 display-modal"
              >
                <Modal.Body
                  className="m-3"
                  style={{ overflowY: "auto", maxHeight: "300px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <MdOutlineCancel
                      type="button"
                      // className="modal-close-button"
                      style={{
                        height: "25px",
                        width: "25px",
                        position: "fixed",
                        marginBottom: "25px",
                      }}
                      onClick={() => handleDisplay()}
                    />
                  </div>
                  {selectedVisibilityRows && selectedVisibilityRows.length ? (
                    selectedVisibilityRows.map((list) => {
                      return (
                        <div
                          key={list.id}
                          style={{ padding: "5px" }}
                          onClick={() => {
                            ProductByCatagory(list.categoryName);
                            setDisplay(false);
                          }}
                        >
                          <h6
                            className="dropdown_text"
                            onClick={() => {
                              const categoryName = list.categoryName;
                              setCategoryName(categoryName);
                            }}
                          >
                            {list.categoryName}
                          </h6>
                        </div>
                      );
                    })
                  ) : (
                    <h6>No List Found</h6>
                  )}
                </Modal.Body>
              </Modal>

              <div className="searchBar ">
                <div className="d-flex  align-items-center align-items-center">
                  <div className="d-flex justify-content-start ">
                    <IoFilterSharp
                      type="button"
                      className="filter-icon"
                      onClick={() => setDisplay((p) => !p)}
                    />
                  </div>

                  <div
                    style={{
                      width: "2px",
                      height: "40px",
                      backgroundColor: "#a3238e",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  />
                </div>
                <div style={{ marginTop: "-50px", textAlign: "center" }}>
                  <h4
                    className="h2"
                    style={{
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    Search Results
                  </h4>
                  <h3 className="h3" style={{ fontSize: "15px" }}>
                    <h6>
                      {`${productList.length} results found for "${categoryName}"`}
                    </h6>
                  </h3>
                </div>
              </div>
              <Row className=" align-items-center">
                <Col sm={12} md={12}>
                  <div className="productCardList">
                    <Row>
                      {productList.map((cardlist, index) => {
                        return (
                          <Col md={12} lg={4} sm={12} key={index}>
                            <Productcard data={cardlist} />
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          sm={0}
          md={0}
          lg={2}
          style={{
            backgroundColor: "#efefef",
          }}
        ></Col>
      </Row>

      {/* categry-components */}
      <CategoryComponent />
      {/* footer */}
      <FinalBarComponent />
    </Container>
  );
};

const mapDispatchToProps = {
  getListOfProduct: (payloadData) => getListOfFilteredProduct(payloadData),
  getProductByCategory: (payloadData) => getProductByCategory(payloadData),
  getCategoryList: (payloadData) => getFilteredCategoryList(payloadData),
  getRelatedProductList: (payloadData) => getRelatedProductList(payloadData),
};
export default connect(null, mapDispatchToProps)(ProductsComponent);
