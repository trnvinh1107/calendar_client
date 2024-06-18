import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditBookingRoom from "./EditBookingRoom";

Modal.setAppElement("#root");

const DetailBookingRoom = ({ isOpen, onClose, selectedEvent }) => {
  const [roomDetail, setRoomDetail] = useState({});
  const [bookingMessage, setBookingMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const checkCanEditOrDelete = useCallback(() => {
    if (
      currentUser &&
      (currentUser.userId === roomDetail.userId || currentUser.isAdmin)
    ) {
      setCanEditOrDelete(true);
    } else {
      setCanEditOrDelete(false);
    }
  }, [currentUser, roomDetail]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    if (selectedEvent) {
      fetchRoomDetail(selectedEvent.id);
    }
  }, [selectedEvent]);

  useEffect(() => {
    checkCanEditOrDelete();
  }, [currentUser, roomDetail, checkCanEditOrDelete]);

  const fetchRoomDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://10.32.5.48:8081/api/v1/bookingroom/${id}`
      );
      setRoomDetail(response.data);
    } catch (error) {
      console.error("Error fetching room detail:", error);
      setBookingMessage("Failed to fetch booking detail.");
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await axios.delete(
        `http://10.32.5.48:8081/api/v1/bookingroom/${selectedEvent.id}`
      );
      alert("Booking deleted successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting booking:", error);
      setBookingMessage("Failed to delete booking.");
    }
  };

  const handleEditBooking = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateBooking = (updatedBooking) => {
    setRoomDetail(updatedBooking);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content bg-white"
    >
      <div className="modal-header">
        <h2 className="modal-title">Booking Detail</h2>
        <div style={{ width: "30%" }}>
          {canEditOrDelete && (
            <>
              <EditIcon
                onClick={handleEditBooking}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  marginRight: "10px",
                }}
              />
              <DeleteIcon
                onClick={handleDeleteBooking}
                style={{ cursor: "pointer", color: "red" }}
              />
            </>
          )}
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
      <div className="modal-body">
        {selectedEvent ? (
          <div>
            <p>
              <strong>User ID:</strong> {roomDetail.userId}
            </p>
            <p>
              <strong>Room ID:</strong> {roomDetail.roomId}
            </p>
            <p>
              <strong>Description:</strong> {roomDetail.description}
            </p>
            <p>
              <strong>Start Time:</strong> {roomDetail.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {roomDetail.endTime}
            </p>
          </div>
        ) : (
          <p>No booking selected.</p>
        )}
        <div className="booking-message">{bookingMessage}</div>
      </div>

      <EditBookingRoom
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        bookingData={roomDetail}
        onUpdate={handleUpdateBooking}
      />
    </Modal>
  );
};

export default DetailBookingRoom;
