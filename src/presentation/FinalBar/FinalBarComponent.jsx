import React from "react";
import { Row, Col } from "react-bootstrap";
import BioOrganicLogo from "../../infrastructure/assets/images/translogo.png";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import PurpleImage from "../../infrastructure/assets/images/purple_circle.png";

export const FinalBarComponent = () => {
  return (
    <Row className="footer align-items-center">
      <Col sm={0} md={0} lg={1}></Col>
      <Col sm={12} md={12} lg={10} className="copyrights-style ">
        <Row
          style={{ width: "100%", marginTop: "-40px" }}
          className=" d-flex justify-content-between"
        >
          {/* Bio-organic */}
          <Col sm={12} md={12} lg={3}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <img className="bio-logo me-2" src={BioOrganicLogo} />
              <span
                style={{
                  fontSize: "25px",
                }}
              >
                BioOrganics
              </span>
            </div>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginTop: "2rem",
                fontSize: "16px",
              }}
            >
              Elevating Your Pharmaceutical Standards Trusted Manufacturer Of
              The Highest Quality Pharmaceutical Reference Standards
            </p>
          </Col>
          {/* contacts */}
          <Col sm={12} md={12} lg={3}>
            <p
              className="phone"
              style={{
                color: "orange",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Phone
            </p>
            <p style={{ color: "white", fontSize: "16px", marginTop: "-20px" }}>
              080 - 2836 4617
            </p>
            <p
              style={{
                color: "orange",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Email
            </p>
            <p style={{ color: "white", fontSize: "16px", marginTop: "-20px" }}>
              contact@bioorganics.biz
            </p>
            <p
              style={{
                color: "orange",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Location
            </p>
            <p style={{ color: "white", fontSize: "16px", marginTop: "-20px" }}>
              B-64/1, III Stage, Peenya Industrial Area, Peenya, Bengaluru - 560
              058
            </p>
          </Col>
          {/* map */}
          <Col sm={12} md={12} lg={3}>
            <p
              className="phone"
              style={{
                color: "orange",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              Locate Us
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15549.583592490426!2d77.492377!3d13.0104422!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3cf61aaaaaab%3A0x5d9b8fc84da867a4!2sBioOrganics!5e0!3m2!1sen!2sin!4v1685433239032!5m2!1sen!2sin"
              style={{
                borderRadius: "10px",
                height: "80%",
                width: "100%",
                marginTop: "-15px",
              }}
            />
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <hr
            style={{
              width: "100%",
              border: " 1px solid #FFFFFF",
            }}
          />
          <h6 style={{ fontSize: "12px", marginBottom: "-80px" }}>
            All Copyrights{" "}
            <AiOutlineCopyrightCircle size={20} className="copyrights" />
            Reserved
          </h6>
        </div>
      </Col>
      <Col sm={0} md={0} lg={1}></Col>
    </Row>
  );
};

export default FinalBarComponent;
