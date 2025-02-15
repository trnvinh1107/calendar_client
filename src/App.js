import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Calendar from "./components/Calendar/Calendar";
import UserList from "./components/User/UserList";
import RoomList from "./components/Room/RoomList";
import DayOffList from "./components/DayOff/DayOffList";
import axios from "axios";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in on initial load
  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("apiToken", user.apiToken);
  };

  const handleLogout = (user) => {
    user = localStorage.getItem("currentUser");
    user = JSON.parse(user);
    axios.post("http://localhost:8081/api/v1/users/logout/" + user.userId, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
      },
    });
    setCurrentUser(null);
    localStorage.removeItem("apiToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };
  const handleExportExcel = async () => {
    const token = localStorage.getItem("apiToken");
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/bookingroom/export",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important: responseType must be 'blob' for file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "booking_rooms.xlsx"); // File name here
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting booking rooms:", error);
      alert("Failed to export booking rooms.");
    }
  };
  const handleExportPdf = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/bookingroom/export/pdf",
        {
          responseType: "blob", // Important: responseType must be 'blob' for file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "booking_rooms.pdf"); // File name here
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting booking rooms as PDF:", error);
      alert("Failed to export booking rooms as PDF.");
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul className="ul-main">
              <li>
                <Link to="/">Home</Link>
              </li>
              {currentUser ? (
                <>
                  <li>
                    <Link to="/calendar">Calendar</Link>
                  </li>
                  {currentUser.isAdmin && (
                    <>
                      <li>
                        <Link to="/users/manage">Manage Users</Link>
                      </li>
                      <li>
                        <Link to="/room/list">Room List</Link>
                      </li>
                      <li>
                        <Link to="/dayoff/list">Day Off List</Link>
                      </li>
                      <li>
                        <div className="export-dropdown">
                          <Link>
                            Export
                          </Link>
                          <div className="export-dropdown-content">
                            <button className="buttonExport" onClick={handleExportExcel}>
                              Excel
                            </button>
                            <button className="buttonExport" onClick={handleExportPdf}>
                              PDF
                            </button>
                          </div>
                        </div>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        marginLeft: 10,
                        background: "none",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                      }}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/calendar" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/calendar"
              element={
                !currentUser ? <Login onLogin={handleLogin} /> : <Calendar />
              }
            />
            <Route path="/register" element={<Register />} />
            {currentUser && currentUser.isAdmin && (
              <>
                <Route path="/users/manage" element={<UserList />} />
                <Route path="/dayoff/list" element={<DayOffList />} />
                <Route path="/room/list" element={<RoomList />} />
              </>
            )}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
