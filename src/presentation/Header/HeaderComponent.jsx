import React, { useState, useEffect } from "react";
import BioOrganicLogo from "../../infrastructure/assets/images/bio-logo.png";
import { BsSearch } from "react-icons/bs";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav, Toast } from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import { connect } from "react-redux";
import SearchModal from "../../infrastructure/components/SearchModal";
import {
  getListOfProduct,
  searchProduct,
  getProductById,
} from "../../application/services/actions/auth";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useNavigate } from "react-router-dom";
import { selectedHeaderProduct } from "../../application/services/actions/count";
import { useSelector } from "react-redux/es/hooks/useSelector";

function HeaderComponent(props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [allProductList, setAllProductList] = useState([]);
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const navigate = useNavigate();
  const [_, setManuallyCleared] = useState(false);
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
  const selectedHeaderData = useSelector(
    (state) => state.countReducer.selectedHeaderProduct
  );
  let sortedselectedHeaderData =
    selectedHeaderData?.length > 50
      ? `${selectedHeaderData.slice(0, 50)}...`
      : selectedHeaderData;

  const handleClearInput = () => {
    setSearch("");
    setManuallyCleared(true);
    props.clearSelectedHeaderProduct();
  };

  useEffect(() => {
    setSearch(sortedselectedHeaderData || "");
  }, [sortedselectedHeaderData]);

  const searchApiCall = async (value) => {
    const payload = {
      pageNumber: 1,
      pageSize: 5,
      search: value,
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

    setStatus(true);
    props
      .searchApi(payload)
      .then((res) => {
        setStatus(false);
        setShow(true);

        setAllProductList(res?.data?.result ? res?.data?.result : []);
      })
      .catch((error) => {
        setStatus(false);
        setAllProductList([]);
      });
  };
  const fetchProductById = (id) => {
    const productId = id; // Replace with the actual product ID
    props
      .getProductBy(productId)
      .then((res) => {
        navigate("/products/detailpage", {
          state: {
            productDetail: res?.data,
          },
        });
      })
      .catch((err) => {});
  };
  return (
    <>
      <Navbar
        expand="xl"
        className="navbar mx-2"
        sticky="top"
        collapseOnSelect
        style={{
          backgroundColor: transparent ? "#F7F7F7" : "rgba(247, 247, 247, 0.9)",
          transition: "background-color 0.3s ease-in-out",
          border: transparent ? "none" : "1px solid #efefef",
          boxShadow:
            "0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container fluid sm={6} lg={12}>
          <Navbar.Brand href="#home">
            <Row className="align-items-center">
              <Col xs={2} md={2} lg={5}>
                <img
                  className="bio-logo me-1"
                  src={BioOrganicLogo}
                  alt="BioOrganicLogo"
                />
              </Col>
              <Col
                xs={10}
                md={10}
                lg={7}
                style={{
                  padding: 0,
                  marginLeft: "-4px",
                }}
              >
                <span
                  style={{
                    fontSize: "33px",
                    color: "#a3238e",
                    padding: 0,
                  }}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  BioOrganics
                </span>
              </Col>
            </Row>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" expand="lg">
            <Col sm={12} md={12} lg={12}>
              <Row className="justify-content-end">
                <Col xs={10} sm={10} md={10} lg={8}>
                  <div className="search-container justify-content-end position-relative d-flex align-items-center">
                    <AiOutlineQuestionCircle
                      size={28}
                      className="info-btn"
                      onClick={() => {
                        toggleShowA();
                      }}
                    />
                    <input
                      className="search-box my-input"
                      placeholder="Enter CAT#,CAS#,Chemical Name or Mol Formula"
                      onChange={(e) => {
                        // setSelectedproduct(null);
                        setSearch(e.target.value);
                        e.target.value.length >= 3
                          ? searchApiCall(e.target.value)
                          : setShow(false);
                        e.target.value === "" ? setShow(false) : setShow(true);
                      }}
                      value={search}
                      onBlur={handleClearInput}
                    />

                    {show && (
                      <>
                        <MdOutlineCancel
                          type="button"
                          color="black"
                          size={20}
                          onClick={() => {
                            setShow(false);
                            setSearch("");
                          }}
                          className="close-btn"
                        />
                        <div className="vl" />
                      </>
                    )}
                    <BsSearch
                      size={25}
                      className="search-btn"
                      onClick={() => {
                        searchApiCall(search);
                      }}
                    />
                  </div>
                  <Toast
                    className="cross-button"
                    show={showA}
                    onClose={toggleShowA}
                  >
                    <Toast.Body>
                      <Col
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <MdOutlineCancel
                          type="button"
                          color="black"
                          size={15}
                          onClick={() => {
                            toggleShowA();
                          }}
                        />
                      </Col>
                      <Row
                        className="justify-content-center"
                        style={{ fontSize: "12px", paddingTop: "0.5rem" }}
                      >
                        <p>
                          Type the keyword in the search bar and click the
                          "Search icon" or press "Enter" on your keyboard
                        </p>
                        <span
                          className="got"
                          style={{ textAlign: "center" }}
                          onClick={() => {
                            toggleShowA();
                          }}
                        >
                          Got It
                        </span>
                      </Row>
                    </Toast.Body>
                  </Toast>
                  {show ? (
                    <SearchModal setShow={setShow}>
                      {status ? (
                        <ScaleLoader
                          color="#a3238e"
                          height={"1rem"}
                          style={{ marginRight: "40rem" }}
                        />
                      ) : null}
                      <div style={{ textAlign: "left" }}>
                        {allProductList && allProductList.length ? (
                          allProductList.map((item) => {
                            return (
                              <div key={item.id}>
                                <h11
                                  onClick={() => {
                                    // setSelectedproduct(item.chemicalName);
                                    props.selectedHeaderProduct(
                                      item?.chemicalName
                                    );
                                    fetchProductById(item.id);

                                    setShow(false);
                                  }}
                                >
                                  {item.chemicalName}
                                </h11>
                              </div>
                            );
                          })
                        ) : (
                          <h6>No Record Found!</h6>
                        )}
                      </div>
                    </SearchModal>
                  ) : null}
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Col lg={10} style={{ paddingLeft: "4rem" }}>
                  <Nav className="d-flex align-items-center justify-content-center">
                    <Nav.Link
                      as={NavLink}
                      to="/"
                      exact="true"
                      className="header-btn mx-1 text-center"
                    >
                      Home
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/corporate"
                      exact="true"
                      className="header-btn mx-1 text-center"
                    >
                      Corporate
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/services"
                      exact="true"
                      className="header-btn mx-1 text-center z"
                    >
                      Services
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/contact"
                      exact="true"
                      className="header-btn mx-1 text-center"
                    >
                      Contact
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/products"
                      exact="true"
                      className="header-btn mx-1 text-center"
                    >
                      Products
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/login"
                      exact="true"
                      className="header-btn mx-1 text-center"
                    >
                      Log In
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/enquirylist"
                      exact="true"
                      className="header-btn-enq mx-1 text-center position-relative"
                    >
                      Enquiry List
                      {props.enquireListData.length > 0 && ( // Render the notification count only if it's greater than 0
                        <span
                          class="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                          style={{
                            background: "#FE8C2A",
                            height: "30px",
                            width: "30px",
                            textAlign: "center",
                            fontSize: "17px",
                            fontWeight: "lighter",
                          }}
                        >
                          {props.enquireListData.length}
                          <span class="visually-hidden">unread messages</span>
                        </span>
                      )}
                    </Nav.Link>
                  </Nav>
                </Col>
              </Row>
            </Col>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

const mapStateToProps = ({
  authReducer: { getProductList },
  countReducer: { enquireListData },
}) => ({
  getProductList,
  enquireListData,
});
const mapDispatchToProps = {
  getListOfProduct: (payloadData) => getListOfProduct(payloadData),
  getProductBy: (payloadData) => getProductById(payloadData),
  searchApi: (payloadData) => searchProduct(payloadData),
  selectedHeaderProduct: (payloadData) => selectedHeaderProduct(payloadData),
  clearSelectedHeaderProduct: () => selectedHeaderProduct(null),
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
