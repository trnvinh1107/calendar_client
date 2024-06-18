import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";
import Login from "./compoment/User/Login";
import Register from "./compoment/User/Register";
import Calendar from "./compoment/Calendar/Calendar";
import UserList from "./compoment/User/UserList";
import RoomList from "./compoment/Room/RoomList";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("apiToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
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
                    </>
                  )}
                  <li>
                    <a
                      onClick={handleLogout}
                      href="#"
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        marginLeft: 10,
                      }}
                    >
                      Đăng xuất
                    </a>
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
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<Calendar />} />
            {currentUser && currentUser.isAdmin ? (
              <Route path="/users/manage" element={<UserList />} />
            ) : null}
            <Route path="/room/list" element={<RoomList />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
