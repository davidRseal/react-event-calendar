import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Month from './Month';
import EventsOverlay from './EventsOverlay';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({
  date,
  dayHeight,
  events,
  onEventClick,
  onSelect,
  calendarStyle,
}) {
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);

  const defaultCalendarStyle = {
    backgroundColor: 'white',
    secondaryColor: 'lightgrey',
    textColor: 'black',
    overlapColor: 'rgb(240,240,240)',
    hoverColor: 'rgb(0, 79, 250)',
    selectColor: 'rgb(220, 239, 255)',
    eventColor: 'rgb(33,150,243)',
    ...calendarStyle,
  };

  function getHeader() {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <td
          key={'week-header-' + i}
          style={{ width: 100 / 7 + '%', padding: '0px' }}
        >
          <div
            style={{
              backgroundColor: defaultCalendarStyle.backgroundColor,
              color: defaultCalendarStyle.textColor,
              display: 'flex',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            {WEEKDAYS[i]}
          </div>
        </td>
      );
    }
    return days;
  }

  return (
    <div style={{ backgroundColor: defaultCalendarStyle.backgroundColor }}>
      <Header
        firstDay={firstDay}
        setFirstDay={setFirstDay}
        calendarStyle={defaultCalendarStyle}
      />
      <div style={{ display: 'grid' }}>
        <table>
          <tbody>
            <tr>{getHeader()}</tr>
          </tbody>
        </table>
      </div>
      <div
        style={{ display: 'grid' }}
        onMouseLeave={() => {
          // purge the highlighting information if the cursor leaves the Calendar
          setStartSelected(null);
          setEndSelected(null);
        }}
      >
        <Month
          firstDay={firstDay}
          startSelected={startSelected}
          setStartSelected={setStartSelected}
          endSelected={endSelected}
          setEndSelected={setEndSelected}
          clickSelection={false}
          dayHeight={dayHeight}
          onSelect={onSelect}
          calendarStyle={defaultCalendarStyle}
        />
        <EventsOverlay
          firstDay={firstDay}
          events={events}
          dayHeight={dayHeight}
          onEventClick={onEventClick}
          calendarStyle={defaultCalendarStyle}
        />
      </div>
    </div>
  );
}

Calendar.propTypes = {
  // sets the default view of the calendar to whichever month contains the given date
  date: PropTypes.object,
  // list of date ranges
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  // sets the total height of the grid cells
  dayHeight: PropTypes.number,
  // callback function for whenever an event is clicked
  onEventClick: PropTypes.func,
  // callback function for whenever a mouseUp event occurs
  onSelect: PropTypes.func,
  // custom themeing object
  calendarStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    textColor: PropTypes.string,
    overlapColor: PropTypes.string,
    hoverColor: PropTypes.string,
    selectColor: PropTypes.string,
    eventColor: PropTypes.string,
  }),
};

Calendar.defaultProps = {
  date: new Date(),
  dayHeight: 100,
  events: [],
  onEventClick: () => { },
  onSelect: () => { },
};
