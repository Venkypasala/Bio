import React, { useState, useEffect } from "react";
import { Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import BioOrganicLogo from "../../infrastructure/assets/images/bio-logo.png";
import { AiOutlineLogout } from "react-icons/ai";
import { IoPersonCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { refreshesToken } from "../../application/services/actions/auth";
import Cookies from "js-cookie";

function RefreshButton({ onClick }) {
  return (
    <button
      style={{
        border: "none",
        backgroundColor: "#a3238e",
        color: "white",
        padding: "8px 20px",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
        marginRight: "10px",
        marginTop: "8px",
        float: "right",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.2s, box-shadow 0.3s",
        fontSize: "12px",
      }}
      onClick={onClick}
      type="submit"
    >
      Stay Logged In
    </button>
  );
}

function AdminHeaderComponent(props) {
  const [showLogoutToolTip, setShowLogoutToolTip] = useState(false);
  const [NewToken, setNewToken] = useState();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const setrefreshToken = Cookies.get("refreshToken");
  const [showRefreshButton, setShowRefreshButton] = useState(true);
  const [showToast, setShowToast] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  const refreshTokenAPI = async () => {
    const payload = {
      userId: userId,
      userName: userName,
      refreshToken: setrefreshToken,
    };
    await props
      .refreshesToken(payload, accessToken)
      .then((res) => {
        setNewToken(res?.data?.newToken);
        const newAccessToken = res?.data?.newToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const navigate = useNavigate();
  const tokenDuration = 1000 * 60 * 10;
  const tokenExpiry = Date.now() + tokenDuration;
  useEffect(() => {
    let interval;
    const checkTokenExpiry = () => {
      const currentTime = Date.now();
      const timeRemaining = tokenExpiry - currentTime;

      if (currentTime > tokenExpiry && showToast) {
        logout();
      } else if (timeRemaining <= 60 * 1000 * 2 && showToast) {
        const toastContent = (
          <div>
            <div>
              Session will be logged out in {Math.round(timeRemaining / 60000)}
              min
            </div>
            {showRefreshButton && (
              <RefreshButton
                onClick={() => {
                  refreshTokenAPI();
                  setShowRefreshButton(false);
                  setShowToast(false);
                }}
              />
            )}
          </div>
        );

        toast.info(toastContent, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 9000,
        });
      }
    };

    const initialDelay = Math.min(60 * 1000 * 1, tokenExpiry - Date.now());

    interval = setInterval(checkTokenExpiry, initialDelay);

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, [tokenExpiry, NewToken]);

  const handleLogOutButton = () => {
    setShowLogoutToolTip(!showLogoutToolTip);
  };
  return (
    <Row className="navbar-admin align-items-center d-flex d-row">
      <Col xs={12} md={12} lg={4} style={{ paddingLeft: "5rem" }}>
        <img className="bio-logo" src={BioOrganicLogo} alt="BioOrganicLogo" />
        <span
          style={{
            fontSize: "35px",
            color: "#a3238e",
          }}
          onClick={() => {
            navigate("/AdminDashboard");
          }}
        >
          {" "}
          BioOrganics
        </span>
      </Col>

      <Col xs={12} md={12} lg={8} className="d-flex justify-content-end">
        <OverlayTrigger
          show={showLogoutToolTip}
          placement="bottom"
          overlay={
            <Tooltip className="tooltip-custom-log">
              <Row
                className="options-button"
                onClickCapture={() => {
                  logout();
                  setShowLogoutToolTip(false);
                }}
              >
                <Col>Logout</Col>
                <Col>
                  <AiOutlineLogout size={25} />
                </Col>
              </Row>
            </Tooltip>
          }
        >
          <button
            style={{ border: "transparent", backgroundColor: "transparent" }}
            onClick={handleLogOutButton}
          >
            <IoPersonCircle size={50} />
          </button>
        </OverlayTrigger>
        <Row>
          <h5
            style={{
              color: "#a3238e",
              fontWeight: "bold",
            }}
          >
            Hello Admin,
          </h5>
          <h5 style={{ color: "grey", fontWeight: "bold" }}>Welcome back!!</h5>
        </Row>
      </Col>
    </Row>
  );
}

const mapDispatchToProps = {
  refreshesToken: (payloadData, accessToken) =>
    refreshesToken(payloadData, accessToken),
};

export default connect(null, mapDispatchToProps)(AdminHeaderComponent);
