import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddBookingRoom from "../BookingRoom/AddBookingRoom";
import DetailBookingRoom from "../BookingRoom/DetailBookingRoom";
import "../../App.css";

function Calendar() {
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.dateStr);
    const currentDate = new Date();

    // Reset time to compare only the date part
    currentDate.setHours(0, 0, 0, 0);

    if (clickedDate < currentDate) {
      alert("Không được chọn ngày của quá khứ.");
    } else {
      setSelectedDate(arg.dateStr);
      setModalAddIsOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalAddIsOpen(false);
    setModalDetailIsOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const bookingInfo = {
      id: event.id,  // Ensure the event ID is passed correctly
      title: event.title,
      start: event.startStr,
      end: event.endStr,
    };
    setSelectedEvent(bookingInfo);
    setModalDetailIsOpen(true);
  };

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (storedUser) {
    setCurrentUser(storedUser);
  }
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/bookingroom"
        );
        const bookingEvents = response.data.map((booking) => ({
          id: booking.id, 
          title: `Room ${booking.roomId}`,
          start: new Date(booking.startTime).toISOString().split("T")[0],
          end: new Date(booking.endTime).toISOString().split("T")[0],
        }));
        setEvents(bookingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
      />
      <AddBookingRoom
        isOpen={modalAddIsOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        currentUser={currentUser} 
      />
      <DetailBookingRoom  
        isOpen={modalDetailIsOpen}
        onClose={handleCloseModal}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}

export default Calendar;
