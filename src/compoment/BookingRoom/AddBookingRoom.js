import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { DateTime } from "luxon";
import "../../App.css";

const dateFormat = "yyyy-MM-dd'T'HH:mm:ss"; // Format used for Luxon

Modal.setAppElement("#root");

const AddBookingRoom = ({ isOpen, onClose, selectedDate }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomSelection = (roomId) => {
    setSelectedRoom(roomId);
  };

  const handleBookRoom = async () => {
    if (!selectedRoom) {
      setBookingMessage("Vui lòng chọn 1 phòng.");
      return;
    }

    const combinedStartTime = `${selectedDate}T${startTime}`;
    const combinedEndTime = `${selectedDate}T${endTime}`;

    const formattedStartTime =
      DateTime.fromISO(combinedStartTime).toFormat(dateFormat);
    const formattedEndTime =
      DateTime.fromISO(combinedEndTime).toFormat(dateFormat);

    if (formattedEndTime <= formattedStartTime) {
      setBookingMessage("Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    try {
      const checkConflictResponse = await axios.get(
        `http://localhost:8081/api/v1/bookingroom/check`,
        {
          params: {
            roomId: selectedRoom,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
        }
      );

      if (checkConflictResponse.data.conflict) {
        setBookingMessage(
          "Phòng này đã có người đặt trước trong thời gian bạn khởi tạo."
        );
        return;
      }

      await axios.post("http://localhost:8081/api/v1/bookingroom", {
        userId: currentUser.userId,
        roomId: selectedRoom,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        description: description,
      });

      alert("Đặt phòng thành công!");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error booking room:",
        error.response ? error.response.data : error.message
      );
      setBookingMessage("Đặt phòng không thành công.");
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
        <h2 className="modal-title">Đặt phòng</h2>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <div>
          <div>
            <label htmlFor="roomSelect">Chọn phòng:</label>
            <select
              id="roomSelect"
              className="room-select"
              value={selectedRoom}
              onChange={(e) => handleRoomSelection(e.target.value)}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - Sức chứa: {room.capacity} - Mô tả: {room.description}
                </option>
              ))}
            </select>
          </div>
          <div className="moTa">
            <label>Mô tả:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="time">
            <label>Thời gian bắt đầu:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label>Thời gian kết thúc:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="booking-message">{bookingMessage}</div>
        <button style={{ color: "white" }} onClick={handleBookRoom}>
          Đặt phòng
        </button>
      </div>
    </Modal>
  );
};

export default AddBookingRoom;
