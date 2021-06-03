import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import Header from './Header';
import EventsOverlay from './EventsOverlay';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY = 24 * 60 * 60 * 1000;

export default function Month({
  date,
  dayHeight,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  clickSelection,
  events,
  onEventClick,
}) {
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [highlighting, setHighlighting] = useState(false);
  let numWeeksInView = 0;

  let prevSelection = useRef(null);
  useEffect(() => {
    if (clickSelection) {
      if (prevSelection.current === endSelected) {
        prevSelection.current = null;
        return;
      }
      if (prevSelection.current !== null) {
        setEndSelected(startSelected);
        setStartSelected(prevSelection.current);
        prevSelection.current = endSelected;
      } else {
        prevSelection.current = startSelected;
      }
    }
  }, [startSelected]);

  function getHeader() {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <td style={{ width: '14.2%', padding: '0px' }}>
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {WEEKDAYS[i]}
          </div>
        </td>
      );
    }
    return days;
  }

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
    numWeeksInView = i;
    return weeks;
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      <Header
        firstDay={firstDay}
        month={firstDay.getMonth()}
        setFirstDay={setFirstDay}
      />
      <table
        cellSpacing="0"
        cellPadding="0"
        style={{
          width: '100%',
        }}
      >
        <tr>{getHeader()}</tr>
      </table>
      <div style={{ display: 'grid' }}>
        <table
          style={{
            backgroundColor: 'lightgrey',
            gridColumn: 1,
            gridRow: 1,
          }}
        >
          {getMonth()}
        </table>
        <EventsOverlay
          weekStart={getSunday(firstDay)}
          events={events}
          dayHeight={dayHeight}
          numWeeksInView={numWeeksInView}
        />
      </div>
    </div>
  );
}

Month.propTypes = {
  date: PropTypes.object,
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
};

Month.defaultProps = {
  date: new Date(),
  dayHeight: '100px',
  clickSelection: false,
};
