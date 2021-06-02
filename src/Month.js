import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import Header from './Header';
import EventsOverlay from './EventsOverlay';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Month({
  date,
  dayHeight,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  clickSelection,
  events,
}) {
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  // const [startSelected, setStartSelected] = useState(null);
  // const [endSelected, setEndSelected] = useState(null);
  const [highlighting, setHighlighting] = useState(false);

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
    let thisDaysEvents = [];
    events.forEach((event) => {
      if (event.start <= event.end) {
        if (currDate >= event.start && currDate <= event.end) {
          thisDaysEvents.push(event);
        }
      } else {
        if (currDate >= event.end && currDate <= event.start) {
          thisDaysEvents.push(event);
        }
      }
    });
    return thisDaysEvents.length ? thisDaysEvents : null;
  }

  function getWeek(weekStart) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      let currDate = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
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
            events={inEventRange(currDate)}
          />
        </td>
      );
    }
    return days;
  }

  function getMonth() {
    let weekStart = getSunday();
    let weeks = [];
    for (let i = 0; i < 6; i++) {
      let currDate = new Date(
        weekStart.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      if (i > 4 && currDate.getMonth() !== firstDay.getMonth()) {
        break;
      }
      weeks.push(<tr>{getWeek(currDate)}</tr>);
    }
    return weeks;
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      <Header
        firstDay={firstDay}
        month={firstDay.getMonth()}
        setFirstDay={setFirstDay}
      />
      {/* {events[0].start.toString()} */}
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
            position: 'absolute',
            width: '100%',
            backgroundColor: 'lightgrey',
            gridColumn: 1,
            gridRow: 1,
          }}
        >
          {getMonth()}
        </table>
        <EventsOverlay weekStart={getSunday(firstDay)} dayHeight={dayHeight} />
      </div>

      {/* <EventsOverlay events={events} dayHeight={dayHeight} /> */}
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
};

Month.defaultProps = {
  date: new Date(),
  dayHeight: '100px',
  clickSelection: false,
};
