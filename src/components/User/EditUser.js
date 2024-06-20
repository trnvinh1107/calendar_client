import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import "../../App.css"
Modal.setAppElement('#root');

const EditUser = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("apiToken");
    try {
      const response = await axios.put(
        `http://localhost:8081/api/v1/users/${user.userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate(response.data);
      onClose();
      alert("Cap nhat thanh cong!");
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error.response.data.error);
      alert('Failed to update user.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white modal-content" overlayClassName="modal-overlay">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="userName" value={formData.userName} readOnly />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Update User</button>
      </form>
    </Modal>
  );
};

export default EditUser;
