import React, { useState, useRef } from 'react';
import Calendar from './Calendar';

const EVENTS = [
  { start: new Date('2021/05/31'), end: new Date('2021/06/01') },
  {
    start: new Date('2021/06/22'),
    end: new Date('2021/06/29'),
    value: <i>italicized text</i>,
  },
  {
    start: new Date('2021/06/03'),
    end: new Date('2021/06/07'),
    value: 'text that is somewhat long',
  },
];

function App() {
  const [events, setEvents] = useState(EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);

  //"user" code
  let prevSelection = useRef(null);
  function handleSelect(start, end) {
    if (start.getTime() === end.getTime() && prevSelection.current === null) {
      prevSelection.current = start;
    } else if (start.getTime() === end.getTime()) {
      // console.log('click selection');
      setEvents([...events, { start: prevSelection.current, end }]);
      // console.log(prevSelection.current, end);
      prevSelection.current = null;
    } else {
      // console.log('drag selection');
      // console.log(start, end);
      setEvents([...events, { start, end }]);
    }
  }

  //"user" code
  function handleEventClick(event) {
    // console.log('Event clicked');
    // console.log(event);
    setSelectedEvent(event);
  }

  function deleteEvent(event) {
    if (event === null) {
      return;
    }
    for (let i = 0; i < events.length; i++) {
      if (events[i].start === event.start && events[i].end === event.end) {
        let reducedEvents = [...events];
        reducedEvents.splice(i, 1);
        setEvents([...reducedEvents]);
      }
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'rgb(244 244 244)',
        padding: '5px',
      }}
    >
      <button onClick={() => setEvents([])}>Delete All Events</button>
      <button onClick={() => deleteEvent(selectedEvent)}>
        Delete Selected Event
      </button>
      {/* Calendar that creates events after every range selection */}
      <Calendar
        events={events}
        dayHeight={'100px'}
        onEventClick={(event) => handleEventClick(event)}
        onSelect={(start, end) => handleSelect(start, end)}
        calendarStyle={{
          backgroundColor: 'white',
          secondaryColor: 'lightgrey',
          textColor: 'black',
          overlapColor: 'rgb(240,240,240)',
          hoverColor: 'rgb(0, 79, 250)',
          selectColor: 'rgb(220, 239, 255)',
          eventColor: 'rgb(33,150,243)',
        }}
      />
      {/* Calendar that doesn't do anything
      <Calendar
        calendarStyle={{
          hoverColor: 'none',
          selectColor: 'none',
        }}
      /> */}
    </div>
  );
}

export default App;
