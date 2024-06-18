import React, { useState } from "react";
import axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Kiểm tra xem userName đã tồn tại chưa
      const checkUserNameResponse = await axios.get(
        `http://10.32.5.48:8081/api/v1/users/check/${formData.userName}`
      );

      if (checkUserNameResponse.data) {
        setError("Username already exists");
        return;
      }

      // Tiếp tục đăng ký nếu userName chưa tồn tại
      const response = await axios.post(
        "http://10.32.5.48:8081/api/v1/users",
        {
          ...formData,
          isAdmin: false, // Set isAdmin to false by default
        }
      );

      console.log("formData registered successfully:", response.data);
      alert("Đăng ký thành công, nhấn OK để chuyển đến trang đăng nhập");
      window.location.href = "/";
    } catch (error) {
      console.error("Error registering formData:", error);
      setError("Registration failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <MDBContainer fluid>
      <form onSubmit={handleSubmit}>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 ">Create Account</h2>
                {error && (
                  <p style={{ color: "red", fontSize: "13px" }}>{error}</p>
                )}
                <MDBInput
                  className="text-white"
                  name="userName"
                  id="userName"
                  required
                  placeholder="Enter User Name"
                  onChange={handleChange}
                  value={formData.userName}
                  style={{ width: "290px" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="User name"
                  type="text"
                  size="lg"
                />
                <MDBInput
                  className="text-white"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter First Name"
                  onChange={handleChange}
                  value={formData.firstName}
                  style={{ width: "290px" }}
                  required
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="First name"
                  type="text"
                  size="lg"
                />
                <MDBInput
                  className="text-white"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter Last Name"
                  onChange={handleChange}
                  value={formData.lastName}
                  required
                  style={{ width: "290px" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Last name"
                  type="text"
                  size="lg"
                />
                <MDBInput
                  className="text-white"
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  required
                  value={formData.email}
                  style={{ width: "290px" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Email"
                  type="email"
                  size="lg"
                />
                <MDBInput
                  className="text-white"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  required
                  value={formData.password}
                  style={{ width: "290px" }}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Password"
                  type="password"
                  size="lg"
                />
                <MDBInput
                  className="text-white"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                  style={{ width: "290px" }}
                  value={formData.confirmPassword}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Confirm Password"
                  type="password"
                  size="lg"
                />
                <MDBBtn
                  type="submit"
                  outline
                  className="mb-3 mx-2 px-5"
                  color="white"
                  size="lg"
                  style={{ width: "175px", backgroundColor: "#04AA6D" }}
                >
                  Register
                </MDBBtn>
                <div>
                  <p className="mb-0">
                    <a
                      href="/"
                      style={{ color: "#128dd3", textDecoration: "underline" }}
                    >
                      Back to Login
                    </a>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  );
};

export default Register;
