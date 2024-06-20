import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  MDBIcon,
} from "mdb-react-ui-kit";

function Login({ onLogin }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, password }),
        }
      );

      if (response.ok) {
        const user = await response.json();
        console.log("Login successful:", user);
        onLogin(user); // Trigger the login function passed from parent component
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('apiToken', user.apiToken); // Store the API token
        navigate("/calendar"); // Redirect to the calendar page after successful login
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="layout">
      <MDBContainer fluid>
        <form onSubmit={handleSubmit}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol col="12">
              <MDBCard
                className="bg-dark text-white my-5 mx-auto"
                style={{ borderRadius: "1rem", maxWidth: "400px" }}
              >
                <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <h2 className="fw-bold mb-2 ">Login</h2>
                  <br />

                  <MDBInput
                    className="text-white"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    style={{ width: "290px" }}
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    label="Username"
                    id="formControlLg"
                    type="text"
                    size="lg"
                  />

                  <MDBInput
                    className="text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "290px" }}
                    wrapperClass="mb-4 mx-5 w-100"
                    labelClass="text-white"
                    label="Password"
                    id="formControlLg"
                    type="password"
                    size="lg"
                  />

                  <p className="small mb-3 pb-lg-2 text-white">
                    <a className="text-white" href="/">
                      Forgot password?
                    </a>
                  </p>
                  {error && <div style={{ color: "red" }}>{error}</div>}

                  <MDBBtn
                    outline
                    className="mx-2 px-5"
                    color="white"
                    size="lg"
                    style={{ width: "180px", backgroundColor: "#04AA6D" }}
                    type="submit"
                  >
                    Login
                  </MDBBtn>

                  <div className="d-flex flex-row mt-0 mb-4">
                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="facebook-f" size="lg" />
                    </MDBBtn>

                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="twitter" size="lg" />
                    </MDBBtn>

                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="google" size="lg" />
                    </MDBBtn>
                  </div>

                  <p className="small mb-3">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      style={{
                        color: "#128dd3",
                        textDecoration: "underline",
                      }}
                    >
                      Register
                    </a>
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </div>
  );
}

export default Login;
