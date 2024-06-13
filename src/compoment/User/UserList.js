import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get('http://10.32.5.48:8081/api/v1/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error.response.data.error);
      });
  }, []);

  const handleAdminChange = (user) => {
    // Optimistically update UI
    const updatedUsers = users.map(u => {
      if (u.userId === user.userId) {
        return { ...u,   isAdmin: !u.isAdmin }; // Toggle isAdmin
      }
      return u;
    });
    setUsers(updatedUsers);

  // Send PUT request to update isAdmin on the server
  axios.put(`http://10.32.5.48:8081/api/v1/users/${user.userId}`, { userName: user.userName, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password,isAdmin: !user.isAdmin })
    .then(response => {
      console.log('Admin status updated successfully:', response.data);

      // Update user state with server response
      const updatedUsers = users.map(u => {
        if (u.userId === user.userId) {
          // Create a new user object with the current data and updated isAdmin status
          return { ...u, isAdmin: !u.isAdmin }; // Toggle isAdmin
      }
        return u;
      });

      setUsers(updatedUsers);
      console.log(updatedUsers);
    })
    .catch(error => {
      console.error('Error updating admin status:', error.response.data.error);
      // Rollback to previous state on error
      setUsers(users);
    });
}; 
  const handleDeleteUser = async (userId) => {
    // Send DELETE request to remove the user
    await axios.delete('http://10.32.5.48:8081/api/v1/users/' + userId);
    alert('Booking deleted successfully!');
    window.location.reload(); 
  };
  return (
    <div className="container form-container">
      <h2>Danh sách người dùng</h2>
      <table border="1">
        <thead>
          <tr>
            <th>id</th>
            <th>Tên người dùng</th>
            <th>Họ</th>
            <th>Tên</th> 
            <th>email</th>
            <th>admin</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => handleAdminChange(user)}
                    defaultChecked={user.isAdmin}
                    />
                  <span className="slider round"></span>
                </label>
              </td>
              <td><DeleteIcon
              onClick={() => handleDeleteUser(user.userId)}
              style={{ cursor: 'pointer', color: 'red' }}
            /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
