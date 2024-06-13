import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';
Modal.setAppElement('#root');

const DetailBookingRoom = ({ isOpen, onClose, selectedEvent }) => {
  const [roomDetail, setRoomDetail] = useState({});
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      fetchRoomDetail(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchRoomDetail = async (id) => {
    try {
      
      const response = await axios.get('http://10.32.5.48:8081/api/v1/bookingroom/' + id);
      setRoomDetail(response.data);
    } catch (error) {
      console.error('Error fetching room detail:', error);
    }
  };
  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete('http://10.32.5.48:8081/api/v1/bookingroom/' + selectedEvent.id);
      alert('Booking deleted successfully!');
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      console.log(id);
      console.error('Error deleting booking:', error);
      setBookingMessage('Failed to delete booking.');
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <div className="modal-header">
        <h2 className="modal-title">Booking Detail</h2>
        <DeleteIcon
              onClick={handleDeleteBooking}
              style={{ cursor: 'pointer', color: 'red' }}
            />
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        {selectedEvent ? (
          <div>
            <p><strong>user Id:</strong> {roomDetail.userId}</p>
            <p><strong>room Id:</strong> {roomDetail.roomId}</p>
            <p><strong>Description:</strong> {roomDetail.description}</p>
            <p><strong>Start Time:</strong> {roomDetail.startTime}</p>
            <p><strong>End Time:</strong> {roomDetail.endTime}</p>
          </div>
        ) : (
          <p>No booking selected.</p>
        )}
        <div className="booking-message">{bookingMessage}</div>
      </div>
    </Modal>
  );
};

export default DetailBookingRoom;
