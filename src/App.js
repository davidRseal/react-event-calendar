import React, { useRef } from 'react';
import Calendar from './Calendar';

// Events must have start < end and they can't overlap
const EVENTS = [
  { start: new Date('2021/05/31'), end: new Date('2021/06/01') },
  { start: new Date('2021/06/22'), end: new Date('2021/07/03') },
  { start: new Date('2021/06/03'), end: new Date('2021/06/06') },
];

function App() {
  let prevSelection = useRef(null);
  function handleSelect(start, end) {
    if (start.getTime() === end.getTime() && prevSelection.current === null) {
      prevSelection.current = start;
    } else if (start.getTime() === end.getTime()) {
      console.log('click selection');
      console.log(prevSelection.current, end);
      prevSelection.current = null;
    } else {
      console.log('drag selection');
      console.log(start, end);
    }
  }

  return (
    <div style={{ backgroundColor: 'purple', padding: '50px' }}>
      <Calendar
        events={EVENTS}
        dayHeight={'100px'}
        onEventClick={(event) => {}}
        onSelect={(start, end) => handleSelect(start, end)}
      />
    </div>
  );
}

export default App;
