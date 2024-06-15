import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { DateTime } from 'luxon';

Modal.setAppElement('#root');

const EditBookingRoom = ({ isOpen, onClose, bookingData, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: bookingData.id,
    userId: bookingData.userId,
    roomId: bookingData.roomId,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    description: bookingData.description,
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData({
      id: bookingData.id,
      userId: bookingData.userId,
      roomId: bookingData.roomId,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      description: bookingData.description,
    });
    setErrorMessage('');
  }, [bookingData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, roomId, startTime, endTime } = formData;

    // Validate time
    const formattedStartTime = DateTime.fromISO(startTime).toFormat("yyyy-MM-dd'T'HH:mm:ss");
    const formattedEndTime = DateTime.fromISO(endTime).toFormat("yyyy-MM-dd'T'HH:mm:ss");

    if (formattedEndTime <= formattedStartTime) {
      setErrorMessage('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }

    try {
      // Check conflict
      const checkConflictResponse = await axios.get('http://192.168.2.6:8081/api/v1/bookingroom/check', {
        params: {
          roomId: roomId,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        },
      });

      if (checkConflictResponse.data.conflict) {
        setErrorMessage('Phòng này đã có người đặt trước trong thời gian bạn chọn.');
        return;
      }

      // Update booking
      await axios.put(`http://192.168.2.6:8081/api/v1/bookingroom/${id}`, formData);
      onUpdate(formData);
      onClose();
      alert('Cập nhật thành công!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating booking room:', error);
      setErrorMessage('Cập nhật phòng không thành công.');
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
        <h2 className="modal-title">Chỉnh sửa Booking Room</h2>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              readOnly
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomId">Room ID:</label>
            <input
              type="text"
              id="roomId"
              name="roomId"
              value={formData.roomId}  
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditBookingRoom;
