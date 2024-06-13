import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../../App.css";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditRoom from "./EditRoom";
import AddRoom from "./AddRoom";

Modal.setAppElement("#root");
const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);
  const handleRoomChange = (room) => {
    // Toggle isActivity locally
    const updatedRooms = rooms.map((u) => {
      if (u.id === room.id) {
        return { ...u, isActivity: !u.isActivity }; // Toggle isActivity
      }
      return u;
    });

    // Update UI immediately
    setRooms(updatedRooms);

    // Send PUT request to update isActivity on the server
    axios
      .put(`http://10.32.5.48:8081/api/v1/rooms/${room.id}`, {
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        isActivity: !room.isActivity,
      })
      .then((response) => {
        console.log("Room status updated successfully:", response.data);

        // Update user state with server response
        const updatedRooms = rooms.map((u) => {
          if (u.id === room.id) {
            return { ...u, isActivity: !u.isActivity };
          }
          return u;
        });

        setRooms(updatedRooms); // Update state after successful server response
      })
      .catch((error) => {
        console.error("Error updating room status:", error.response.data.error);
        // Rollback to previous state on error
        setRooms(rooms);
      });
  };
  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://10.32.5.48:8081/api/v1/rooms/admin"
      );
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
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
    await axios.delete(`http://10.32.5.48:8081/api/v1/rooms/${id}`);
    alert("Room deleted successfully!");
    fetchRooms(); // Reload rooms after deletion
  };

  return (
    <div className="room-list">
      <h2>Danh sách phòng</h2>
      <button  onClick={() => handleAddRoom()}
         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}>Them phong</button>
      <table>
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
      <AddRoom
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}  
      />
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
