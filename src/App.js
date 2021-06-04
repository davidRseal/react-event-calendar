import React, { useState, useRef } from 'react';
import Calendar from './Calendar';

// const EVENTS = [
//   { start: new Date('2021/05/31'), end: new Date('2021/06/01') },
//   { start: new Date('2021/06/22'), end: new Date('2021/06/29') },
//   { start: new Date('2021/06/03'), end: new Date('2021/06/06') },
// ];

function App() {
  const [events, setEvents] = useState([]);

  //"user" code
  let prevSelection = useRef(null);
  function handleSelect(start, end) {
    if (start.getTime() === end.getTime() && prevSelection.current === null) {
      prevSelection.current = start;
    } else if (start.getTime() === end.getTime()) {
      console.log('click selection');
      setEvents([...events, { start: prevSelection.current, end }]);
      // console.log(prevSelection.current, end);
      prevSelection.current = null;
    } else {
      console.log('drag selection');
      // console.log(start, end);
      setEvents([...events, { start, end }]);
    }
  }

  //"user" code
  function handleEventClick(event) {
    console.log('Event clicked');
    console.log(event);
  }

  return (
    <div style={{ padding: '50px' }}>
      <Calendar
        events={events}
        dayHeight={'100px'}
        onEventClick={(event) => handleEventClick(event)}
        onSelect={(start, end) => handleSelect(start, end)}
      />
    </div>
  );
}

export default App;
