// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './compoment/User/Login';
import Register from './compoment/User/Register';
import Calendar from './compoment/Calendar/Calendar';
import UserList from './compoment/User/UserList'; 
import RoomList from './compoment/Room/RoomList';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/users/manage" element={<UserList />} />
            <Route path="/room/list" element={<RoomList />} />
         </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
