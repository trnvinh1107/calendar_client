// src/compoment/Room/RoomList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditRoom from "./EditRoom";
import AddRoom from "./AddRoom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const token = localStorage.getItem("apiToken");
    try {
      const response = await fetch("http://localhost:8081/api/v1/rooms/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        
      setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleRoomChange = (room) => {
    const updatedRooms = rooms.map((r) => {
      if (r.id === room.id) {
        return { ...r, isActivity: !r.isActivity };
      }
      return r;
    });

    setRooms(updatedRooms);

    axios
      .put(`http://localhost:8081/api/v1/rooms/${room.id}`, {
        ...room,
        isActivity: !room.isActivity,
      })
      .then((response) => {
        console.log("Room status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating room status:", error.response.data.error);
        setRooms(rooms);
      });
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  const handleUpdateRoom = (updatedRoom) => {
    const updatedRooms = rooms.map((r) =>
      r.id === updatedRoom.id ? updatedRoom : r
    );
    setRooms(updatedRooms);
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = async (id) => {
    await axios.delete(`http://localhost:8081/api/v1/rooms/${id}`);
    alert("Room deleted successfully!");
    fetchRooms();
  };

  return (
    <div className="room-list">
      <h2>Danh sách phòng</h2>
      <button
        onClick={() => handleAddRoom()}
        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
      >
        Thêm phòng
      </button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phòng</th>
            <th>Sức chứa</th>
            <th>Mô tả</th>
            <th>Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.name}</td>
              <td>{room.capacity}</td>
              <td>{room.description}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => handleRoomChange(room)}
                    defaultChecked={room.isActivity}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <EditIcon
                  onClick={() => handleEditRoom(room)}
                  style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                />
                <DeleteIcon
                  onClick={() => handleDeleteRoom(room.id)}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddRoom isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditRoom
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        room={selectedRoom}
        onUpdate={handleUpdateRoom}
      />
    </div>
  );
};

export default RoomList;
