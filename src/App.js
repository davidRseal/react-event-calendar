import React, { useState, useRef } from 'react';
import Calendar from './Calendar';
import { TiDelete } from 'react-icons/ti';

const TODAY = new Date();
const TOMORROW = new Date(TODAY);
TOMORROW.setDate(TODAY.getDate() + 1);
const EVENTS = [
  {
    start: TODAY,
    end: TOMORROW,
    value: 'Events can have any content or color',
    color: 'red'
  }
];

function App() {
  const [events, setEvents] = useState(EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);

  //"user" code
  let prevSelection = useRef(null);
  const deleting = useRef(false);
  function handleSelect(start, end) {
    let randomColor =
      'rgb(' +
      Math.floor(Math.random() * 256) +
      ',' +
      Math.floor(Math.random() * 256) +
      ',' +
      Math.floor(Math.random() * 256) +
      ')';
    const eventStuff = {
      color: randomColor,
      value: (
        <div
          style={{
            margin: 0,
            float: 'right',
            fontSize: '20px',
          }}
        >
          <TiDelete
            style={{ cursor: 'pointer' }}
            onClick={() => (deleting.current = true)}
          />
        </div>
      ),
    };
    if (start.getTime() === end.getTime() && prevSelection.current === null) {
      prevSelection.current = start;
    } else if (start.getTime() === end.getTime()) {
      setEvents([
        ...events,
        {
          start: prevSelection.current,
          end,
          ...eventStuff,
        },
      ]);
      prevSelection.current = null;
    } else {
      setEvents([...events, { start, end, ...eventStuff }]);
    }
  }

  //"user" code
  function handleEventClick(event) {
    setSelectedEvent(event);
    if (deleting.current) {
      deleting.current = false;
      deleteEvent(event);
    }
  }

  //"user" code
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
        padding: '20px',
      }}
    >
      <button onClick={() => setEvents([])}>Delete All Events</button>
      <button onClick={() => deleteEvent(selectedEvent)}>
        Delete Selected Event
      </button>
      {/* Calendar that creates events after every range selection */}
      <Calendar
        events={events}
        dayHeight={100}
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
      {/* <Calendar events={EVENTS} /> */}
    </div>
  );
}

export default App;
