import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import Header from './Header';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Month({ date }) {
  // const [viewMonth, setViewMonth] = useState(date.getMonth());
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);
  const [highlighting, setHighlighting] = useState(false);
  // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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

  function getWeek(weekStart) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <td style={{ width: '14.2%', padding: '0px' }}>
          <Day
            viewMonth={firstDay.getMonth()}
            date={new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000)}
            startSelected={startSelected}
            setStartSelected={setStartSelected}
            endSelected={endSelected}
            setEndSelected={setEndSelected}
            highlighting={highlighting}
            setHighlighting={setHighlighting}
          />
        </td>
      );
    }
    return days;
  }

  function getMonth() {
    let weekStart = getSunday();
    let weeks = [];
    weeks.push(<tr>{getHeader()}</tr>);
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
        style={{ width: '100%', height: '100%', backgroundColor: 'lightgrey' }}
      >
        {getMonth()}
      </table>
    </div>
  );
}

Month.propTypes = {
  date: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
};

Month.defaultProps = {
  date: new Date(),
};
