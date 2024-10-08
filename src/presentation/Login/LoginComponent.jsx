import React, { useState } from "react";
import LoginImg from "../../infrastructure/assets/images/login_design.jpeg";
import LoginLogo from "../../infrastructure/assets/images/login-logo.jpg";
import { logIn } from "../../application/services/actions/auth";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginComponent = (props) => {
  let validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email Required"),
    password: Yup.string().required("Password Required"),
  });
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const formHandler = async () => {
    let payload = {
      username: values.email,
      password: values.password,
    };

    await props
      .logIn(payload)
      .then((res) => {
        const refreshToken = res?.data?.refreshToken;
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}`;
        }
        if (res?.data?.accessToken) {
          localStorage.setItem("accessToken", res?.data?.accessToken);
          localStorage.setItem("userId", res?.data?.userId);
          localStorage.setItem("userName", res?.data?.username);
          navigate("/AdminDashboard");
          if (res?.data?.accessToken) {
            toast.success("Login Successful", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        } else {
          toast.error("Invalid Credentials!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      })
      .catch((error) => {
        toast.error(error?.reason, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setIsClicked(false);
      });
  };

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      enableReinitialize: true,
      validateOnBlur: true,
      validateOnChange: true,
      validateOnMount: true,
      validationSchema: validationSchema,
      onSubmit: () => {
        formHandler();
      },
    });
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    handleSubmit();
  };

  return (
    <Container fluid className="main-login" sm={12} md={12} lg={12}>
      <Row className="login">
        <Col sm={0} md={0} lg={1} style={{ backgroundColor: "black" }} />
        <Col sm={10} md={10} lg={4} style={{ backgroundColor: "black" }}>
          <Row>
            <Col className="login-container">
              <Row
                sm={0}
                md={0}
                lg={6}
                className="d-flex justify-content-center align-items-center"
              >
                <Col
                  xs={2}
                  md={2}
                  lg={5}
                  style={{ float: "right", marginRight: "-1.5rem" }}
                >
                  <img
                    className="bio-logo me-2"
                    src={LoginLogo}
                    onClick={() => {
                      navigate("/");
                    }}
                  />
                </Col>
                <Col xs={10} md={10} lg={7}>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "#a3238e",
                      float: "left",
                      marginRight: "4rem",
                    }}
                  >
                    BioOrganics
                  </span>
                </Col>
              </Row>
              <div
                style={{
                  //borderTop: "2px solid #fff ",
                  marginLeft: 15,
                  marginRight: 15,
                }}
              ></div>
              <hr />
              <h3 className="mt-3" style={{ fontWeight: "bold" }}>
                Log in
              </h3>
              <Row xs={10} md={10} lg={12}>
                <form onSubmit={handleSubmit}>
                  <Row sm={10} md={10} lg={11}>
                    <div>
                      <input
                        id="email"
                        name="email"
                        value={values.email}
                        className="justify-content-end"
                        placeholder="Email Address"
                        style={{
                          width: "60%",
                          height: "3rem",
                          borderRadius: "5px",
                          border: "1px solid rgb(209 209 209)",
                          padding: "8px",
                        }}
                        onChange={handleChange("email")}
                        onBlur={handleBlur}
                      />
                      {touched.email && errors.email ? (
                        <div style={{ color: "red" }}>{errors.email}</div>
                      ) : null}
                    </div>
                  </Row>
                  <Row sm={10} md={10} lg={11}>
                    <div>
                      <input
                        id="password"
                        name="password"
                        value={values.password}
                        type={passwordType}
                        onChange={handleChange("password")}
                        onBlur={handleBlur}
                        className="justify-content-end"
                        placeholder="Password"
                        style={{
                          width: "60%",
                          height: "3rem",
                          borderRadius: "5px",
                          border: "1px solid rgb(209 209 209)",
                          marginTop: "10px",
                          padding: "8px",
                        }}
                      />
                      {passwordType === "password" ? (
                        <AiOutlineEye
                          className="input-group-btn"
                          size={20}
                          onClick={togglePassword}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          className="input-group-btn"
                          size={20}
                          onClick={togglePassword}
                        />
                      )}

                      {touched.password && errors.password ? (
                        <div style={{ color: "red" }}>{errors.password}</div>
                      ) : null}
                    </div>
                  </Row>
                </form>
              </Row>
              <Row
                style={{ marginLeft: "57px", marginRight: "57px" }}
                className="d-flex justify-content-between align-items-center mt-3"
              ></Row>
              <Row>
                <Col>
                  <button
                    type={"submit"}
                    disabled={isClicked}
                    onClick={handleClick}
                    className={
                      isClicked
                        ? "login-submit-btn disabled"
                        : "login-submit-btn"
                    }
                  >
                    Submit
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={12} lg={7}>
          <img className="background-img" src={LoginImg} />
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = ({ authReducer: { logIn } }) => ({
  logIn,
});
const mapDispatchToProps = {
  logIn: (payloadData) => logIn(payloadData),
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
