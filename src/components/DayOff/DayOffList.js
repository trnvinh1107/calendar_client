// src/compoment/dayOff/DayOffList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditDayOff from "./EditDayOff";
import AddDayOff from "./AddDayOff";

const DayOffList = () => {
  const [dayOffs, setDayOffs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDayOff, setSelectedDayOff] = useState(null);

  useEffect(() => {
    fetchDayOff();
  }, []);

  const fetchDayOff = async () => {
    const token = localStorage.getItem("apiToken");
    try {
      const response = await fetch("http://localhost:8081/api/v1/dayoff/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();

        setDayOffs(data);
      }
    } catch (error) {
      console.error("Error fetching dayOff:", error);
    }
  };

  const handleDayOffChange = (dayOff) => {
    const updatedDayOffs = dayOffs.map((r) => {
      if (r.id === dayOff.id) {
        return { ...r, isActivity: !r.isActivity };
      }
      return r;
    });

    setDayOffs(updatedDayOffs);
    console.log(localStorage.getItem("apiToken"));
    axios
      .put(
        `http://localhost:8081/api/v1/dayoff/${dayOff.id}`,
        {
          ...dayOff,
          isActivity: !dayOff.isActivity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
          },
        }
      )
      .then((response) => {
        console.log("Day Off status updated successfully:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error updating Day Off status:",
          error.response.data.error
        );
        setDayOffs(dayOffs);
      });
  };

  const handleEditDayOff = (dayOff) => {
    setSelectedDayOff(dayOff);
    setIsEditModalOpen(true);
  };

  const handleAddDayOff = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDayOff(null);
  };

  const handleUpdateDayOff = (updatedDayOff) => {
    const updatedDayOffs = dayOffs.map((r) =>
      r.id === updatedDayOff.id ? updatedDayOff : r
    );
    setDayOffs(updatedDayOffs);
    setIsEditModalOpen(false);
    setSelectedDayOff(null);
  };

  const handleDeleteDayOff = async (id) => {
    await axios.delete(`http://localhost:8081/api/v1/dayoff/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
      },
    });
    alert("dayOff deleted successfully!");
    fetchDayOff();
  };

  return (
    <div className="dayOff-list">
      <h2>Danh sách ngày nghỉ</h2>
      <button
        onClick={() => handleAddDayOff()}
        style={{ cursor: "pointer", color: "white", margin: "10px" }}
      >
        Thêm ngày nghỉ
      </button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên ngày nghỉ</th>
            <th>Ngày nghỉ</th>
            <th>Mô tả</th>
            <th>Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dayOffs.map((dayOff) => (
            <tr key={dayOff.id}>
              <td>{dayOff.id}</td>
              <td>{dayOff.name}</td>
              <td>{dayOff.dayOff}</td>
              <td>{dayOff.description}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => handleDayOffChange(dayOff)}
                    defaultChecked={dayOff.isActivity}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <EditIcon
                  onClick={() => handleEditDayOff(dayOff)}
                  style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                />
                <DeleteIcon
                  onClick={() => handleDeleteDayOff(dayOff.id)}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddDayOff isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditDayOff
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        dayOff={selectedDayOff}
        onUpdate={handleUpdateDayOff}
      />
    </div>
  );
};

export default DayOffList;
