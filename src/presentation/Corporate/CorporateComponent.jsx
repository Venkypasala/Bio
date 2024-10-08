import React, { useState, useEffect, useRef } from "react";
import HeaderComponent from "../Header/HeaderComponent";
import CorporatePic1 from "../../infrastructure/assets/biolab/corpimage-1.png";
import CorporatePic2 from "../../infrastructure/assets/images/corporate-pic2.png";
import FinalBarComponent from "../FinalBar/FinalBarComponent";
import { Container, Row, Col, Card, Modal } from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import Carousel from "react-multi-carousel";
import { useParams } from "react-router-dom";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import QualityImage from "../../infrastructure/assets/icons/Quality Icon.svg";
import Confidential from "../../infrastructure/assets/images/confidential.png";
import TimeFrame from "../../infrastructure/assets/icons/timeframe.svg";
import Archive from "../../infrastructure/assets/icons/archive.svg";

export const CorporateComponent = () => {
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(false);
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [promiseCenterCardIndex, setPromiseCenterCardIndex] = useState(1);
  const { id } = useParams();
  const scrollToRef = useRef(null);
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

  useEffect(() => {
    if (id) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id]);
  const responsive = {
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

  const handleBeforeChange = (currentSlide, nextSlide) => {
    setActiveIndex(nextSlide);
  };
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
  let CardList = [
    {
      id: 1,
      name: "Quality",
      description:
        "All Product well characterized using NMR, MS and HPLC, Certificate of Analysis will be provided.",
      logo: QualityImage,
    },
    {
      id: 2,
      name: "Confidentiality",
      description: (
        <ul>
          <li>Strict confidentiality will be maintained</li>
          <li>All employees have signed the confidentiality agreement</li>
          <li>NDA is in place with all the transacting organizations</li>
        </ul>
      ),
      logo: Confidential,
    },
    {
      id: 3,
      name: "Time Frame",
      description:
        "All the products will be delivered punctually as per the agreed time schedule with constant channel of communication with clients regarding the progress of the synthesis.",
      logo: TimeFrame,
    },
    {
      id: 4,
      name: "Archive",
      description:
        "Both soft-copies and hard-copies will be preserved as per regulatory requirements.",
      logo: Archive,
    },
    {
      id: 5,
      name: "Superior Service",
      description:
        "A dedicated professional customer service team positioned to ensure customer satisfaction and technical support.",
      logo: QualityImage,
    },
  ];

  const CustomButtonGroup = ({ next, previous }) => (
    <div className="custom-button-group">
      <BsFillArrowLeftSquareFill
        onClick={() => {
          previous();
          promiseCenterCardIndex === 1
            ? null
            : setPromiseCenterCardIndex(promiseCenterCardIndex - 1);
        }}
        size={"20px"}
        className={
          CardList.length <= 2
            ? "ArrowIcon2"
            : promiseCenterCardIndex === 1
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
      <BsFillArrowRightSquareFill
        onClick={() => {
          next();
          CardList.length <= 2
            ? null
            : (screenSize.width < 464
                ? CardList.length
                : CardList.length - 2) === promiseCenterCardIndex
            ? null
            : setPromiseCenterCardIndex(promiseCenterCardIndex + 1);
        }}
        size={"20px"}
        className={
          CardList.length <= 2
            ? "ArrowIcon2"
            : (screenSize.width < 464
                ? CardList.length
                : CardList.length - 2) === promiseCenterCardIndex
            ? "ArrowIcon2"
            : "ArrowIcon"
        }
      />
    </div>
  );
  const handleClose = () => setShow(false);

  const handleCancelButton = () => {
    window.open("https://www.google.com", "_self");
    window.close();
    setShow((p) => !p);
  };

  return (
    <Container fluid className="main">
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
      {/* State of the Art */}
      <Row className="section-top align-items-center">
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
        <Col
          sm={12}
          md={6}
          lg={4}
          style={{ paddingLeft: "3rem", textAlign: "left" }}
        >
          <h2 className="h21">State of the Art</h2>
          <h2 className="h22">laboratory in Banglore</h2>
          <h6
            className="h61"
            style={{
              marginTop: "18px",
              lineHeight: "24px",
            }}
          >
            Recognized By DSIR, Department of Biotechnologies, Department of
            Atomic Energy, Government of India.
            <br /> BioOrganics lab is the only laboratory in the country to have
            a unique collaborative agreement with the Department of Atomic
            Energy's Heavy Water Board for supply of Deuterium Oxide for
            Research and Development in the Non-nuclear use of Heavy Water
          </h6>
        </Col>
        <Col sm={12} md={6} lg={6}>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: "2rem",
            }}
          >
            <img className="corporatimage1" src={CorporatePic1} />
          </div>
        </Col>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
      </Row>
      {/* About Our Story */}
      <Row
        id="About"
        ref={scrollToRef}
        className="section-story align-items-center"
      >
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#f7f7f7" }} />

        <Col sm={8} lg={4}>
          <div
            style={
              {
                //paddingLeft:"1rem"
              }
            }
          >
            <img className="corporatimage2" src={CorporatePic2} />
          </div>
        </Col>
        <Col
          sm={12}
          lg={6}
          style={{ paddingLeft: "2rem", textAlign: "justify" }}
        >
          <h6 className="corporateabouttext">About</h6>
          <h2 className="corporateourstorytext">Our Story</h2>
          <div>
            <p className="h61">
              BioOrganics is a leading manufacture of speciality research of
              chemicals for pharmaceutical and biomedical research. The company
              was founded by Dr.Vijaykumar Hulikal, a distinguished scientist in
              the year 2001.
            </p>
            <p className="h61">
              BioOrganics was conceptualized with Dr.Hulikal's vision of a
              seamless amalgamation of academia and industry for providing
              medicinal chemistry and organic synthetic services of the highest
              quality.
            </p>
          </div>
          <div className="h61">
            <p>
              The company has developed technologies for the manufacturers of
              Stable Isotope Labeled products, Referencen Standards,
              Metabolites, Impurities and Glucuronides among its vast array of
              20,000+ products. BioOrganics also provides custom synthesis of
              organic compounds.
            </p>
          </div>
          <div className="h61">
            <p>
              BioOrganics has championed the field of Deuterium Labelling
              Chemistry.
            </p>
          </div>
        </Col>
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#f7f7f7" }} />
      </Row>
      {/* The BioOrganics Promise */}
      <Row className="section-promise ">
        <Col sm={12} md={12} lg={12}>
          <Row>
            <h2 className="h25 text-center mb-5">The BioOrganics Promise</h2>
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
            responsive={responsive}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            slidesToSlide={1}
            swipeable
          >
            {CardList && CardList.length ? (
              CardList.map((cardDetails, index) => {
                return (
                  <Col key={index} style={{ paddingLeft: "40px" }}>
                    <Card
                      className={
                        CardList.length <= 3 || screenSize.width < 464
                          ? "promise-card"
                          : index === promiseCenterCardIndex
                          ? "promise-card-2"
                          : "promise-card"
                      }
                      style={{
                        height: screenSize.width < 464 ? "13rem" : null,
                      }}
                    >
                      <Card.Body>
                        <Row>
                          <Col
                            sm={4}
                            lg={4}
                            style={{
                              paddingTop:
                                index === promiseCenterCardIndex ? "6%" : "2%",
                            }}
                          >
                            {cardDetails.logo ? (
                              <img
                                style={{
                                  paddingTop:
                                    index === promiseCenterCardIndex
                                      ? "1%"
                                      : "12%",
                                }}
                                src={cardDetails.logo}
                              />
                            ) : (
                              <h6>No Image Found</h6>
                            )}
                          </Col>
                          <Col sm={8} lg={8}>
                            <Card.Title
                              style={{
                                textAlign: "left",
                                color: "#a3238e",
                                fontWeight: "bold",
                                marginTop: "6px",
                              }}
                            >
                              {cardDetails.name ? cardDetails.name : " --"}
                            </Card.Title>
                            <Card.Text
                              style={{
                                textAlign: "left",
                                fontSize:
                                  index === promiseCenterCardIndex
                                    ? "13px"
                                    : "12px",
                                marginLeft:
                                  index === promiseCenterCardIndex
                                    ? "-15px"
                                    : "",
                              }}
                            >
                              {cardDetails.description
                                ? cardDetails.description
                                : " --"}
                            </Card.Text>
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
      {/* Why BioOrganics */}
      <Row className="section-why align-items-center">
        <Row>
          <h2
            className="text-center mt-5"
            style={{ color: "#a3238e", fontWeight: "bold" }}
          >
            Why BioOrganics
          </h2>
        </Row>
        <Row className="align-center rowstyle-corporate">
          <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#f7f7f7" }} />
          <Col className="col1style">
            <Col sm={4} md={8} lg={8}>
              <div className="col1div2 text-center">
                <h5 className="h5all">Subject Matter &nbsp; Expertise</h5>
              </div>
              <div className="coldiv">
                <p className="div1para text-center">
                  BioOrganics is led by an acclaimed scientist with a large term
                  of organic chemists. Our chemists have year of experience in
                  the exploratory project research and collaborative R & D
                  synthesis applied in pharmaceutical and chemical industries
                </p>
              </div>
            </Col>
          </Col>
          <Col className="col1style">
            <Col sm={12} md={6}>
              <div className="col1div2 ">
                <h5 className="h5all">State of the Art Laboratory</h5>
              </div>
              <div className="coldiv text-center">
                <p className="div1para">
                  BioOrganics is duly recognized for its research activities by
                  various Department of the Government of India, including:
                  Department of Scientific and Industrial Research (DSIR)
                  Department of Biotechnology (DBT) Department of Atomic Energy
                  (DAE) - Heavy Water Board (HWB){" "}
                </p>
              </div>
            </Col>
          </Col>
          <Col className="col1style">
            <Col sm={12} md={6}>
              <div className="col1div2 text-center">
                <h5 className="h5all" style={{ paddingTop: "12%" }}>
                  Customer Service
                </h5>
              </div>
              <div className="coldiv text-center">
                <p className="div1para">
                  Our customer service team is led by technical team of expert.
                  Organic Chemists. We offer quick and comprehensive response in
                  case of sale queries and off replacement guarantee in case of
                  any issues.
                </p>
              </div>
            </Col>
          </Col>
        </Row>
      </Row>
      <FinalBarComponent />
    </Container>
  );
};

export default CorporateComponent;
