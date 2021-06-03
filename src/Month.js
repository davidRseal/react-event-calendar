import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';

const DAY = 24 * 60 * 60 * 1000;

export default function Month({
  firstDay,
  dayHeight,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  events,
  onEventClick,
  onSelect,
  setNumWeeksInView,
}) {
  const [highlighting, setHighlighting] = useState(false);

  useEffect(() => {
    if (!highlighting && startSelected && endSelected) {
      onSelect(startSelected, endSelected);
    }
  }, [startSelected, endSelected]);

  function getSunday() {
    let firstDayCopy = new Date(firstDay);
    let day = firstDayCopy.getDay();
    let diff = firstDayCopy.getDate() - day;
    return new Date(firstDayCopy.setDate(diff));
  }

  function inEventRange(currDate) {
    let todaysEvent = null;
    events.forEach((event) => {
      if (currDate >= event.start && currDate <= event.end) {
        todaysEvent = event;
        return;
      }
    });
    return todaysEvent;
  }

  function getWeek(weekStart) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      let currDate = new Date(weekStart.getTime() + i * DAY);
      days.push(
        <td style={{ width: 100 / 7 + '%', padding: '0px' }}>
          <Day
            viewMonth={firstDay.getMonth()}
            dayHeight={dayHeight}
            date={currDate}
            startSelected={startSelected}
            setStartSelected={setStartSelected}
            endSelected={endSelected}
            setEndSelected={setEndSelected}
            highlighting={highlighting}
            setHighlighting={setHighlighting}
            event={inEventRange(currDate)}
            onEventClick={onEventClick}
          />
        </td>
      );
    }
    return days;
  }

  function getMonth() {
    let weekStart = getSunday();
    let weeks = [];
    let i = 0;
    for (; i < 6; i++) {
      let currDate = new Date(weekStart.getTime() + i * 7 * DAY);
      if (i > 4 && currDate.getMonth() !== firstDay.getMonth()) {
        break;
      }
      weeks.push(<tr>{getWeek(currDate)}</tr>);
    }
    setNumWeeksInView(i);
    return weeks;
  }

  return (
    <table
      style={{
        backgroundColor: 'lightgrey',
        gridColumn: 1,
        gridRow: 1,
      }}
    >
      {getMonth()}
    </table>
  );
}

Month.propTypes = {
  firstDay: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.string,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.object,
  setEndSelected: PropTypes.func,
  clickSelection: PropTypes.bool,
  onEventClick: PropTypes.func,
  onSelect: PropTypes.func,
  setNumWeeksInView: PropTypes.func,
};

Month.defaultProps = {
  date: new Date(),
  dayHeight: '100px',
  clickSelection: false,
};
