import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditUser from './EditUser'; // Import EditUser component

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.2.6:8081/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response.data.error);
    }
  };

  const handleAdminChange = (user) => {
    const updatedUsers = users.map((u) => {
      if (u.userId === user.userId) {
        return { ...u, isAdmin: !u.isAdmin };
      }
      return u;
    });
    setUsers(updatedUsers);

    axios
      .put(`http://192.168.2.6:8081/api/v1/users/${user.userId}`, {
        ...user,
        isAdmin: !user.isAdmin,
      })
      .then((response) => {
        console.log('Admin status updated successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error updating admin status:', error.response.data.error);
        setUsers(users);
      });
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`http://192.168.2.6:8081/api/v1/users/${userId}`);
    alert('User deleted successfully!');
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((u) => (u.userId === updatedUser.userId ? updatedUser : u));
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setSelectedUser(null);
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
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
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
              <td>
                <EditIcon
                  onClick={() => handleEditUser(user)}
                  style={{ cursor: 'pointer', color: 'blue', marginRight: 10 }}
                />
                <DeleteIcon
                  onClick={() => handleDeleteUser(user.userId)}
                  style={{ cursor: 'pointer', color: 'red' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditUser
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
};

export default UserList;
