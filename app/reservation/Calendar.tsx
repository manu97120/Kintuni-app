import React, { useState } from "react";
import styles from "./Calendar.module.css";

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
  unavailableDates: string[];
  minDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  onSelectDate,
  selectedDate,
  unavailableDates,
  minDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    if (newDate >= minDate) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const isDateUnavailable = (date: Date) => {
    return (
      unavailableDates.includes(date.toISOString().split("T")[0]) ||
      date < minDate
    );
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      const isUnavailable = isDateUnavailable(date);
      days.push(
        <div
          key={i}
          className={`
            ${styles.calendarDay} 
            ${selectedDate && selectedDate.toDateString() === date.toDateString() ? styles.selected : ""}
            ${isUnavailable ? styles.unavailable : ""}
          `}
          onClick={() => !isUnavailable && onSelectDate(date)}
        >
          {i}
        </div>,
      );
    }
    return days;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={handlePrevMonth} disabled={currentDate <= minDate}>
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className={styles.calendarGrid}>
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <div key={day} className={styles.calendarWeekday}>
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className={styles.calendarDay}></div>
          ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar;
