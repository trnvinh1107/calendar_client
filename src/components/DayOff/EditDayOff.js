import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../../App.css";

Modal.setAppElement("#root");

const EditDayOff = ({ isOpen, onClose, dayOff, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    dayOff: "",
    description: "",
    isActivity: false,
  });

  useEffect(() => {
    if (dayOff) {
      setFormData({
        name: dayOff.name,
        dayOff: dayOff.dayOff,
        description: dayOff.description,
        isActivity: dayOff.isActivity
      });
    }
  }, [dayOff]);

  const handleChange = (e) => {
    const value =
    e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  setFormData({ ...formData, [e.target.name]: value });};
  const token = localStorage.getItem("apiToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://10.32.5.48:8081/api/v1/dayoff/${dayOff.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("DayOff updated successfully:", response.data);
      onUpdate(response.data); // Update the DayOff list with the updated DayOff
      onClose(); // Close the modal
      alert("DayOff updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating DayOff:", error);
    }
  };

  if (!dayOff) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content bg-white"
    >
      <div className="modal-header">
        <h2 className="modal-title">Edit DayOff</h2>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="dayOff">dayOff:</label>
          <input
            type="date"
            id="dayOff"
            name="dayOff"
            value={formData.dayOff}
            onChange={handleChange}
            required
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <label htmlFor="isActivity">Is Activity:</label>
          <input
            type="checkbox"
            id="isActivity"
            name="isActivity"
            checked={formData.isActivity}
            onChange={handleChange}
            style={{margin: '10px'}}
            // required
          />
          <button type="submit">Update DayOff</button>
        </form>
      </div>
    </Modal>
  );
};

export default EditDayOff;
