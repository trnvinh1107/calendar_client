import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../../App.css";

Modal.setAppElement("#root");

const EditRoom = ({ isOpen, onClose, room, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    description: "",
    isActivity: false,
  });

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        isActivity: room.isActivity
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const value =
    e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  setFormData({ ...formData, [e.target.name]: value });};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8081/api/v1/rooms/${room.id}`,
        formData
      );
      console.log("Room updated successfully:", response.data);
      onUpdate(response.data); // Update the room list with the updated room
      onClose(); // Close the modal
      alert("Room updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  if (!room) {
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
        <h2 className="modal-title">Edit Room</h2>
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
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
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
            // required
          />
          <button type="submit">Update Room</button>
        </form>
      </div>
    </Modal>
  );
};

export default EditRoom;
