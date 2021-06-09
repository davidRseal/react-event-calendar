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

  //   let prevSelection = useRef(null);
  //   useEffect(() => {
  //     if (clickSelection) {
  //       if (prevSelection.current === endSelected) {
  //         prevSelection.current = null;
  //         return;
  //       }
  //       if (prevSelection.current !== null) {
  //         setEndSelected(startSelected);
  //         setStartSelected(prevSelection.current);
  //         prevSelection.current = endSelected;
  //       } else {
  //         prevSelection.current = startSelected;
  //       }
  //     }
  //   }, [startSelected]);

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
        month={firstDay.getMonth()}
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
      <div style={{ display: 'grid' }}>
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
  date: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.number,
  onEventClick: PropTypes.func,
  onSelect: PropTypes.func,
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
  onEventClick: () => {},
  onSelect: () => {},
};
