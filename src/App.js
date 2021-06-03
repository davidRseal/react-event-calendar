import React, { useState } from 'react';
import Month from './Month';

// Events must have start < end and they can't overlap
const EVENTS = [
  { start: new Date('2021/05/31'), end: new Date('2021/06/01') },
  { start: new Date('2021/06/22'), end: new Date('2021/07/03') },
  { start: new Date('2021/06/03'), end: new Date('2021/06/06') },
];

function App() {
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);

  return (
    <div style={{ backgroundColor: 'purple', padding: '50px' }}>
      <Month
        events={EVENTS}
        startSelected={startSelected}
        setStartSelected={setStartSelected}
        endSelected={endSelected}
        setEndSelected={setEndSelected}
        clickSelection={false}
        dayHeight={'100px'}
        onEventClick={(event) => {}}
      />
    </div>
  );
}

export default App;
