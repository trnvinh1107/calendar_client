// src/compoment/User/UserList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditUser from "./EditUser";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [error, setError] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    const token = localStorage.getItem("apiToken");
    console.log(token);
    try {
      const response = await fetch("http://10.32.5.48:8081/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get('http://10.32.5.48:8081/api/v1/users');
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error('Error fetching users:', error.response.data.error);
  //   }
  // };

  const handleAdminChange = (user) => {
    const updatedUsers = users.map((u) => {
      if (u.userId === user.userId) {
        return { ...u, isAdmin: !u.isAdmin };
      }
      return u;
    });
    setUsers(updatedUsers);

    axios
      .put(
        `http://10.32.5.48:8081/api/v1/users/${user.userId}`,
        {
          ...user,
          isAdmin: !user.isAdmin,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Admin status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error updating admin status:",
          error.response.data.error
        );
        setUsers(users);
      });
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("apiToken");
    try {
      await axios.delete(`http://10.32.5.48:8081/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    }
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
    const updatedUsers = users.map((u) =>
      u.userId === updatedUser.userId ? updatedUser : u
    );
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
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
                  style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                />
                <DeleteIcon
                  onClick={() => handleDeleteUser(user.userId)}
                  style={{ cursor: "pointer", color: "red" }}
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
