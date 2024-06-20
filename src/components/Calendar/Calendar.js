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
  const [events, setEvents] = useState([]);
  const [dayOffs, setDayOffs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    const fetchEvents = async () => {
      try {
        const [eventsResponse, dayOffsResponse] = await Promise.all([
          axios.get("http://localhost:8081/api/v1/bookingroom"),
          axios.get("http://localhost:8081/api/v1/dayoff"),
        ]);

        const bookingEvents = eventsResponse.data
          .map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);

            if (isNaN(start) || isNaN(end)) {
              console.error("Invalid date format for booking:", booking);
              return null;
            }

            return {
              id: booking.id,
              title: `Room ${booking.roomId}`, // Ensure title is set correctly
              start: start.toISOString(),
              end: end.toISOString(),
              color: booking.color,
              className: "booking-room", // Add this class for booking room events
            };
          })
          .filter((event) => event !== null);

        const dayOffEvents = dayOffsResponse.data
          .map((dayOff) => {
            const date = new Date(dayOff.dayOff);

            if (isNaN(date)) {
              console.error("Invalid date format for dayOff:", dayOff);
              return null;
            }

            return {
              id: dayOff.id,
              title: "dayOff", // Use dayOff name as title
              start: date.toISOString().split("T")[0],
              display: "background",
              classNames: ["day-off"],
              extendedProps: { isDayOff: true },
              name: dayOff.name,
              description: dayOff.description,
            };
          })
          .filter((event) => event !== null);

        setEvents(bookingEvents);
        setDayOffs(dayOffEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.dateStr);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dayOff = dayOffs.find((dayOff) => {
      const dayOffDate = new Date(dayOff.start);
      dayOffDate.setHours(7, 0, 0, 0);
      console.log(dayOffDate + " abc " + clickedDate);
      return (
        dayOffDate.getDate() === clickedDate.getDate() &&
        dayOffDate.getHours() === clickedDate.getHours()
      );
    });
    // console.log("dayoff " + JSON.stringify(dayOff));
    if (clickedDate < currentDate) {
      alert("Không được chọn ngày của quá khứ.");
    } else if (dayOff) {
      alert(
        "Không được đặt phòng vào ngày nghỉ.\nNgày " +
          dayOff.name +
          " là ngày: " +
          dayOff.description
      );
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
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
    };
    setSelectedEvent(bookingInfo);
    setModalDetailIsOpen(true);
  };
  const renderEventContent = ({ event }) => {
    if (event.extendedProps.isDayOff) {
      return (
        <div
          className="day-off"
          style={{ backgroundColor: "red", pointerEvents: "none", height: "100%" }}
        >
          <span style={{ color: "#ccc" }}>{event.title}</span>
        </div>
      );
    } else {
      return (
        <div
          className="booking-room"
          style={{ backgroundColor: event.backgroundColor || "blue" , width: "100%"}}
        >
          <b style={{ color: "#fff" }}>{event.title}</b>
        </div>
      );
    }
  };
  const handleEventDidMount = (arg) => {
    if (arg.event.extendedProps.isDayOff) {
      arg.el.style.pointerEvents = "none"; // Disable click on day-off events
    }
  };
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
        events={[...events, ...dayOffs]}
        // eventColor={(event) => event.color || 'blue'}
        eventContent={renderEventContent} // Sử dụng hàm renderEventContent để xử lý nội dung sự kiện
        eventDidMount={handleEventDidMount}
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
