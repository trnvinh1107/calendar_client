import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
Modal.setAppElement("#root");

const AddDayOff = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [addDayOffMessage, setAddDayOffMessage] = useState("");
  const [dayOff, setDayOff] = useState("");
  const [isActivity, setIsActivity] = useState(true);
  
  const handleAddDayOff = async () => {
    if (!name || !description) {
      setAddDayOffMessage("Vui lòng điền tất cả các trường.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/v1/dayoff", {
        name,
        dayOff,
        description,
        isActivity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apiToken')}`
        }
      });

      alert("Thêm ngày nghỉ thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding DayOff:", error.response ? error.response.data : error.message);
      setAddDayOffMessage("Thêm ngày nghỉ không thành công.");
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
        <h2 className="modal-title">Thêm ngày nghỉ mới</h2>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <div>
          <label>Tên ngày nghỉ:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            style={{margin: "10px 40px",width: "270px"}}
          />
        </div>
        <div>
          <label>Ngày nghỉ:</label>
          <input
            type="date"
            value={dayOff}
            onChange={(e) => setDayOff(e.target.value)}
            style={{margin: "10px 45px",width: "270px"}}
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{margin: "10px 0 10px 75px",width: "270px"}}
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

        <div className="add-DayOff-message">{addDayOffMessage}</div>
        <button onClick={handleAddDayOff} style={{marginLeft: "35%"}}>Thêm ngày nghỉ</button>
      </div>
    </Modal>
  );
};

export default AddDayOff;
