import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Month from './Month';
import EventsOverlay from './EventsOverlay';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY = 24 * 60 * 60 * 1000;

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
  const [numWeeksInView, setNumWeeksInView] = useState(0);

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

  function getSunday() {
    let firstDayCopy = new Date(firstDay);
    let day = firstDayCopy.getDay();
    let diff = firstDayCopy.getDate() - day;
    return new Date(firstDayCopy.setDate(diff));
  }

  const eventsLength = useRef(null);
  function cleanEvents(events) {
    if (events.length === eventsLength.current) {
      return events;
    }
    let cleanEvents = events.map((event) => ({ ...event }));
    for (let i = 0; i < cleanEvents.length; i++) {
      let event = cleanEvents[i];
      if (event.start > event.end) {
        let temp = event.end;
        event.end = event.start;
        event.start = temp;
      }
    }
    cleanEvents.sort((a, b) => a.start - b.start);
    for (let a = 0; a < cleanEvents.length; a++) {
      for (let b = 0; b < cleanEvents.length; b++) {
        if (a === b) continue;
        let eventA = cleanEvents[a];
        let eventB = cleanEvents[b];
        if (eventA.start <= eventB.start && eventA.end >= eventB.start) {
          // if B is fully contained in A
          if (eventA.end >= eventB.end) {
            cleanEvents.splice(b, 1);
            if (a > b) a--; //reset a when array shifts
            b--; // reset b for next iteration
          } else {
            cleanEvents[b].start = new Date(eventA.end.getTime() + DAY);
          }
        }
      }
    }
    eventsLength.current = cleanEvents.length;
    return cleanEvents;
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
          setNumWeeksInView={setNumWeeksInView}
          calendarStyle={defaultCalendarStyle}
        />
        <EventsOverlay
          weekStart={getSunday(firstDay)}
          events={cleanEvents(events)}
          dayHeight={dayHeight}
          numWeeksInView={numWeeksInView}
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
  dayHeight: PropTypes.string,
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
  dayHeight: '100px',
  events: [],
  onEventClick: () => {},
  onSelect: () => {},
};
