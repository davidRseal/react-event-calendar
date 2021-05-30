import React from 'react';
// import Cell from './Cell';
import Month from './Month';

const events = [{ start: new Date('2021/05/16'), end: new Date('2021/05/20') }];

function App() {
  return (
    <div style={{ backgroundColor: 'lightblue' }}>
      <Month events={events} />
    </div>
  );
}

export default App;
