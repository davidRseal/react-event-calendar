import React, { useState } from 'react';
// import Cell from './Cell';
import Month from './Month';

const events = [{ start: new Date('2021/05/17'), end: new Date('2021/05/20') }];

function App() {
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);

  return (
    <div style={{ backgroundColor: 'lightblue' }}>
      <Month
        events={events}
        startSelected={startSelected}
        setStartSelected={setStartSelected}
        endSelected={endSelected}
        setEndSelected={setEndSelected}
        clickSelection={false}
      />
    </div>
  );
}

export default App;
