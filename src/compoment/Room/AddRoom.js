import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const AddRoom = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [isActivity, setIsActivity] = useState(true);
  const [addRoomMessage, setAddRoomMessage] = useState("");

  const handleAddRoom = async () => {
    if (!name || !capacity || !description) {
      setAddRoomMessage("Vui lòng điền tất cả các trường.");
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      setAddRoomMessage("Sức chứa phải là số dương.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/v1/rooms", {
        name,
        capacity: parseInt(capacity),
        description,
        isActivity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apiToken')}`
        }
      });

      alert("Thêm phòng thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding room:", error.response ? error.response.data : error.message);
      setAddRoomMessage("Thêm phòng không thành công.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content bg-white"
    >
      <div className="modal-header">
        <h2 className="modal-title">Thêm phòng mới</h2>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <div>
          <label>Tên phòng:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Sức chứa:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Hoạt động:</label>
          <input
            type="checkbox"
            checked={isActivity}
            onChange={(e) => setIsActivity(e.target.checked)}
          />
        </div>

        <div className="add-room-message">{addRoomMessage}</div>
        <button onClick={handleAddRoom}>Thêm phòng</button>
      </div>
    </Modal>
  );
};

export default AddRoom;
