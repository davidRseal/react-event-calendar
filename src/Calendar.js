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
}) {
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);
  const [numWeeksInView, setNumWeeksInView] = useState(0);

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
        <Month
          firstDay={firstDay}
          events={events}
          startSelected={startSelected}
          setStartSelected={setStartSelected}
          endSelected={endSelected}
          setEndSelected={setEndSelected}
          clickSelection={false}
          dayHeight={dayHeight}
          onEventClick={onEventClick}
          onSelect={onSelect}
          setNumWeeksInView={setNumWeeksInView}
        />
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

Calendar.propTypes = {
  date: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.string,
  onEventClick: PropTypes.func,
  onSelect: PropTypes.func,
};

Calendar.defaultProps = {
  date: new Date(),
  dayHeight: '100px',
  clickSelection: false,
};
