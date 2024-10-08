import React from "react";
import SheImage from "../../infrastructure/assets/biolab/hero-section.png";
import bioBuilding from "../../infrastructure/assets/biolab/builidin.jpg";
import bioLab from "../../infrastructure/assets/biolab/lab.jpg";
import elavatingText from "../../infrastructure/assets/biolab/elavText.svg";
import highestText from "../../infrastructure/assets/biolab/Highest.svg";
import HeaderComponent from "../Header/HeaderComponent";
import FinalBarComponent from "../FinalBar/FinalBarComponent";
import { MdOutlineCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { useNavigate } from "react-router-dom";
import { getCertificateList } from "../../application/services/actions/auth";
import { getLatestProduct } from "../../application/services/actions/auth";
import { getFilteredCategoryList } from "../../application/services/actions/auth";
import { connect } from "react-redux";
import productData from "../json/productCategory.json";
// import PopModal from "../../infrastructure/components/modal/PopModal";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import Loader from "../../infrastructure/components/Loader/Loader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const HomeComponent = (props) => {
  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [certificateList, setCertificateList] = useState([]);
  const [latestProductList, setLatestProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [certificateCenterCardIndex, setCertificateCenterCardIndex] =
    useState(1);
  const [latestProductPageNumber, setLatestProductpageNumber] = useState(2);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(false);

  const [transparent, setTransparent] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setTransparent(false);
    } else {
      setTransparent(true);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    speed: 1200,
    beforeChange: (newIndex) => {
      setTimeout(() => {
        setCurrentSlide(newIndex);
      }, 0);
    },
    afterChange: (index) => {
      setTimeout(() => {
        setCurrentSlide(index);
      }, 0);
    },
    arrows: false,
  };

  const getZoomClass = (index) => {
    return index === currentSlide ? "zoom-in" : "";
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
  };
  const certificateResponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 576 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
    },
  };
  const init = () => {
    const payload = {
      pageNumber: 1,
      pageSize: 24,
      search: "",
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
    };
    setStatus(true);
    props
      .getCertificateList(payload)
      .then((res) => {
        setStatus(false);

        setCertificateList(res?.data?.result || []);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const getCategories = () => {
    const result = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 3,
      search: "",
      sortDirection: "",
      sortField: "",
    };
    props
      .getCategoryList(result)
      .then((res) => {
        setStatus(false);

        let selectedCategory = res?.data?.result;
        setCategoryList(selectedCategory);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const getLatestProduct = () => {
    const payloads = {
      pageNumber: 1,
      pageSize: 4,
      search: "",
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
      .getLatestProduct(payloads)
      .then((res) => {
        setStatus(false);
        const visibleCategory = res?.data.result.filter(
          (item) => item.isVisible !== true && item.isDelete === false
        );
        setLatestProductList(visibleCategory || []);
      })
      .catch((error) => {
        setStatus(false);
      });
  };
  const CustomButtonGroup = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          certificateCenterCardIndex === 1
            ? null
            : setCertificateCenterCardIndex(certificateCenterCardIndex - 1);
        }}
        size={"20px"}
        className={
          certificateList.length <= 2
            ? "ArrowIcon2"
            : certificateCenterCardIndex === 1
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          certificateList.length <= 3
            ? null
            : (screenSize.width < 464
                ? certificateList.length
                : certificateList.length - 3) === certificateCenterCardIndex
            ? null
            : setCertificateCenterCardIndex(certificateCenterCardIndex + 1);
        }}
        size={"20px"}
        className={
          certificateList.length <= 3
            ? "ArrowIcon2"
            : (screenSize.width < 464
                ? certificateList.length
                : certificateList.length - 3) === certificateCenterCardIndex
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
    </div>
  );

  const LatestProductCustomButtonGroup = ({ next, previous }) => (
    <div className="custom-button-group2">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          latestProductPageNumber === 2 || latestProductPageNumber === 1
            ? null
            : (previous(),
              setLatestProductpageNumber(latestProductPageNumber - 1));
        }}
        size={"20px"}
        className={
          latestProductPageNumber === 2 || latestProductPageNumber === 1
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          latestProductPageNumber === 2 || latestProductPageNumber === 3
            ? null
            : (next(), setLatestProductpageNumber(latestProductPageNumber + 1));
        }}
        size={"20px"}
        className={
          latestProductPageNumber === 2 || latestProductPageNumber === 3
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
    </div>
  );

  const ProductDataButtonGroup = ({ next, previous }) => (
    <div className="custom-button-group2">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          latestProductPageNumber === 2 || latestProductPageNumber === 1
            ? null
            : (previous(),
              setLatestProductpageNumber(latestProductPageNumber - 1));
        }}
        size={"20px"}
        className={
          latestProductPageNumber === 2 || latestProductPageNumber === 1
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          latestProductPageNumber === 4 || latestProductPageNumber === 5
            ? null
            : (next(), setLatestProductpageNumber(latestProductPageNumber + 1));
        }}
        size={"20px"}
        className={
          latestProductPageNumber === 4 || latestProductPageNumber === 5
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
    </div>
  );

  useEffect(() => {
    init();
    getCategories();
    getLatestProduct();
  }, []);

  const handleClose = () => setShow(false);

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };
  // Modal controls

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };
  const handleBeforeChange = (currentSlide, nextSlide) => {
    setActiveIndex(nextSlide);
  };
  return (
    <Container fluid className="main-home">
      {status ? <Loader status={status} /> : null}
      {/* Header */}
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

      {/* Trusted Manufacturer */}

      <Row className="section1-home">
        <Col sm={12} md={12} lg={12}>
          <div
            style={{
              height: "570px",
              width: "100%",
              paddingLeft: "2%",
              paddingRight: "2%",
            }}
          >
            <Slider {...settings}>
              <div className={`slider-item`}>
                <div className={` ${getZoomClass(0)}`}>
                  <img src={bioBuilding} />
                </div>
                <div className="overlay-box" />
                <div
                  style={{
                    zIndex: "3",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  <img src={elavatingText} />
                </div>
              </div>

              <div className={`slider-item`}>
                <div className={` ${getZoomClass(1)}`}>
                  <img style={{ objectFit: "cover" }} src={bioLab} />
                </div>
                <div className="overlay-box" />
                <div
                  style={{
                    zIndex: "3",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  <img src={highestText} />
                </div>
              </div>
            </Slider>
          </div>
        </Col>
      </Row>

      {/* Latest Products */}
      <Row className="section2-home  align-items-center ">
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />

        <Col
          sm={12}
          lg={3}
          style={{ marginBottom: "8rem", textAlign: "justify" }}
        >
          <h6 className="h62">Our</h6>
          <h2 className="h22">Latest Products</h2>
          <button
            className="prod_btn"
            onClick={() => {
              navigate("/products");
            }}
          >
            Show More
          </button>
        </Col>
        <Col sm={12} lg={7} className="">
          <Row className="ProductContainer">
            <Carousel
              additionalTransfrom={0}
              arrows={false}
              className="productCarousel"
              containerClass="my-carousel"
              customButtonGroup={<LatestProductCustomButtonGroup />}
              itemClass="productCard"
              renderArrowsWhenDisabled={false}
              renderButtonGroupOutside
              slidesToSlide={2}
              responsive={responsive}
            >
              {latestProductList && latestProductList.length ? (
                latestProductList.map((cardDetails) => {
                  return (
                    <Col key={cardDetails.id} className="p-3 ">
                      <Card className="latestCard">
                        <Card.Body>
                          <Row>
                            <Col lg={9} md={9} sm={12}>
                              {cardDetails.productImage ? (
                                <img
                                  style={{
                                    height: "100px",
                                    width: "100%",
                                    marginLeft: "10%",
                                    objectFit: "fill",
                                    paddingRight: "12px",
                                  }}
                                  src={cardDetails.productImage}
                                  alt="Product"
                                />
                              ) : (
                                <span className="latestChemicalName">NA</span>
                              )}
                            </Col>
                            <Col className="text-center " lg={3} md={3} sm={12}>
                              <p
                                style={{
                                  color: "#f6913a",
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                              >
                                NEW
                              </p>
                            </Col>
                          </Row>
                          <div
                            style={{
                              textAlign: "center",
                              width: "100%",
                              objectFit: "fill",
                              height: "1px",
                              color: "black",
                              backgroundColor: "black",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          />

                          <div className="text-center">
                            <Card.Title
                              className="latestChemicalName"
                              style={{
                                color: "#f6913a",
                                fontWeight: "bold",
                                fontSize: "15px",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {cardDetails.chemicalName
                                ? cardDetails.chemicalName
                                : "----"}
                            </Card.Title>
                            <Card.Text>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  marginBottom: "-10px",
                                }}
                              >
                                Molecular Formula :{" "}
                                {cardDetails.molecularFormula
                                  ? cardDetails.molecularFormula
                                  : "----"}
                              </p>
                            </Card.Text>
                            <Card.Text>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  paddingBottom:
                                    cardDetails.casNumber === null &&
                                    screenSize.width < 464
                                      ? "1.2rem"
                                      : null,
                                }}
                              >
                                CAS Number :{" "}
                                {cardDetails.casNumber
                                  ? cardDetails.casNumber
                                  : "----"}
                              </p>
                            </Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <div>
                  <h1>No Records Found!!</h1>
                </div>
              )}
            </Carousel>
          </Row>
          <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
        </Col>
      </Row>

      {/* Sub Heading */}
      <Row className="section3-home align-items-center">
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />

        <Col sm={12} md={6} lg={5}>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "2rem",
            }}
          >
            <img className="corporatimage1" src={SheImage} />
          </div>
        </Col>
        <Col sm={12} md={6} lg={5} style={{ textAlign: "justify" }}>
          <h6 className="h62">About</h6>
          <h2 className="h22">BioOrganics</h2>
          <h6 className="h61">
            BioOrganics expertise lies in pioneering organic chemistry
            techniques, crafting exclusive complex molecules, producing 100,000+
            products, including Stable Isotope Labeled standards, Pharmaceutical
            Reference Standards, Metabolites, Pharmaceutical Impurity Standards,
            and Glucuronides. Additionally, the company offers tailored
            synthesis of organic compounds with innovation at the core.
          </h6>
          <button
            className="prod_btn"
            onClick={() => {
              navigate("/corporate/About");
            }}
          >
            Know More
          </button>
        </Col>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
      </Row>

      {/* Product Categories */}
      <Row
        className="section2-home align-items-center"
        style={{ backgroundColor: "#EFEFE", paddingBottom: "10px" }}
      >
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />

        <Col
          sm={12}
          lg={3}
          style={{ marginBottom: "8rem", textAlign: "justify" }}
        >
          <h6 className="h62">Area of expertise</h6>
          <h2 className="h23">Product Categories</h2>
          <button
            className="prod_btn"
            onClick={() => {
              navigate("/contact");
            }}
          >
            Know More
          </button>
        </Col>
        <Col sm={12} lg={7} className="">
          <Row className="ProductContainer">
            <Carousel
              additionalTransfrom={0}
              arrows={false}
              className="productCarousel"
              containerClass="my-carousel"
              customButtonGroup={<ProductDataButtonGroup />}
              itemClass="productCard"
              renderArrowsWhenDisabled={false}
              renderButtonGroupOutside
              slidesToSlide={2}
              responsive={responsive}
            >
              {productData && productData.length ? (
                productData.map((cardDetails) => {
                  return (
                    <Col key={cardDetails.id} className="p-3 ">
                      <Card className="latestCard">
                        <Card.Body>
                          <Row>
                            <Col lg={9} md={9} sm={12}>
                              {cardDetails.image ? (
                                <img
                                  style={{
                                    height: "100px",
                                    width: "100%",
                                    marginLeft: "10%",
                                    objectFit: "fill",
                                    paddingLeft: "30px",
                                  }}
                                  src={cardDetails.image}
                                  alt="Product"
                                />
                              ) : (
                                <span className="latestChemicalName">NA</span>
                              )}
                            </Col>
                            <Col
                              className="text-center "
                              lg={1}
                              md={1}
                              sm={12}
                            />
                          </Row>
                          <div
                            style={{
                              textAlign: "center",
                              width: "100%",
                              objectFit: "fill",
                              height: "1px",
                              color: "black",
                              backgroundColor: "black",
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          />

                          <div className="text-center">
                            <Card.Title
                              className="latestChemicalName"
                              style={{
                                color: "#f6913a",
                                fontWeight: "bold",
                                fontSize: "17px",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {cardDetails.category
                                ? cardDetails.category
                                : "----"}
                            </Card.Title>
                            <Card.Title
                              className="latestChemicalName"
                              style={{
                                color: "#f6913a",
                                fontWeight: "normal",
                                fontSize: "14px",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {cardDetails.name ? cardDetails.name : "----"}
                            </Card.Title>
                            <Card.Text>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  marginBottom: "-10px",
                                }}
                              >
                                Molecular Formula :{" "}
                                {cardDetails.molecularFormula
                                  ? cardDetails.molecularFormula
                                  : "----"}
                              </p>
                            </Card.Text>
                            <Card.Text>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  paddingBottom:
                                    cardDetails.CASNumber === null &&
                                    screenSize.width < 464
                                      ? "1.2rem"
                                      : null,
                                }}
                              >
                                CAS Number :{" "}
                                {cardDetails.CASNumber
                                  ? cardDetails.CASNumber
                                  : "----"}
                              </p>
                            </Card.Text>
                            <Card.Text>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  marginTop: "-10px",
                                  paddingBottom:
                                    cardDetails.molecularWeight === null &&
                                    screenSize.width < 464
                                      ? "1.2rem"
                                      : null,
                                }}
                              >
                                Molecular Weight :{" "}
                                {cardDetails?.molecularWeight
                                  ? cardDetails.molecularWeight
                                  : "----"}
                              </p>
                            </Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <div>
                  <h1>No Records Found!!</h1>
                </div>
              )}
            </Carousel>
          </Row>
          <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
        </Col>
      </Row>
      {/* certificateList */}
      <Row className="section-promise" style={{ backgroundColor: "#FFFDFD" }}>
        <Col sm={12} md={12} lg={12}>
          <Row>
            <h2 className="h25 text-center mb-5">
              Certificates of accreditations
            </h2>
          </Row>
          <Carousel
            additionalTransfrom={0}
            arrows={false}
            autoPlaySpeed={3000}
            beforeChange={handleBeforeChange}
            customButtonGroup={<CustomButtonGroup />}
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite={false}
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside
            renderDotsOutside={false}
            responsive={certificateResponsive}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            slidesToSlide={1}
            swipeable
          >
            {certificateList && certificateList.length ? (
              certificateList.map((cardDetails, index) => {
                return (
                  <Col key={cardDetails.id} style={{ paddingLeft: "40px" }}>
                    <Card
                      className={
                        certificateList.length <= 3 || screenSize.width < 464
                          ? "certificate-card"
                          : index === certificateCenterCardIndex
                          ? "certificate-card-2"
                          : "certificate-card"
                      }
                      style={{
                        height: screenSize.width < 464 ? "13rem" : null,
                      }}
                    >
                      <Card.Body>
                        <Card.Title
                          style={{
                            textAlign: "center",
                            color: "#a3238e",
                            fontWeight: "bold",
                            paddingLeft: "15%",
                          }}
                        >
                          {cardDetails.name ? cardDetails.name : " --"}
                        </Card.Title>
                        <Row>
                          <Col sm={2} lg={2} style={{ marginTop: "-25px" }}>
                            {cardDetails.logo ? (
                              <img
                                src={`data:image/jpeg;base64,${cardDetails.logo}`}
                                height="80px"
                                width="80px"
                              />
                            ) : (
                              <h6>No Image Found</h6>
                            )}
                          </Col>
                          <Col
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                            sm={10}
                            lg={10}
                          >
                            <Card.Text>
                              {cardDetails.description
                                ? cardDetails.description
                                : " --"}
                            </Card.Text>
                            <button
                              onClick={handleShowModal}
                              className="certificate-btn"
                            >
                              View Certificate
                            </button>
                            {/* <PopModal show={showModal} onHide={handleHideModal}>
                              <h1 style={{ color: "#a3238e" }}>
                                {cardDetails.name}
                              </h1>
                              <div className="d-flex">
                                <img
                                  src={`data:image/jpeg;base64,${cardDetails.logo}`}
                                  height="100px"
                                  width="150px"
                                />
                                <p>{cardDetails.description}</p>
                              </div>
                            </PopModal> */}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div>
                <h1>No Records Found!!</h1>
              </div>
            )}
          </Carousel>
        </Col>
      </Row>

      <FinalBarComponent />
    </Container>
  );
};

const mapDispatchToProps = {
  getCertificateList: (payload) => getCertificateList(payload),
  getLatestProduct: (payloads) => getLatestProduct(payloads),
  getCategoryList: (result) => getFilteredCategoryList(result),
};
export default connect(null, mapDispatchToProps)(HomeComponent);
