import React, { useState, useRef } from 'react';
import Calendar from './Calendar';
import { TiDelete } from 'react-icons/ti';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Calendar');

function InteractiveCalendar({ scrollMode }) {
  // this is all "user" code
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  function handleEventClick(event) {
    setSelectedEvent(event);
    if (deleting.current) {
      deleting.current = false;
      deleteEvent(event);
    }
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
        maxWidth: '1000px',
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
        scrollMode={scrollMode}
      />
    </div>
  );
}

InteractiveCalendar.PropTypes = {
  scrollMode: PropTypes.bool,
};

stories.add('Preset Events', () => {
  const EVENTS = [
    {
      start: new Date('2023-01-02'),
      end: new Date('2023-01-04'),
      value: 'Events can have any content or color',
      color: 'red',
    },
    {
      start: new Date('2023-01-03'),
      end: new Date('2023-01-06'),
      value: 'They can overlap endlessly',
      color: 'yellow',
    },
    {
      start: new Date('2023-01-01'),
      end: new Date('2023-01-05'),
      color: 'lightblue',
    },
    {
      start: new Date('2023-01-20'),
      end: new Date('2023-01-25'),
      value: 'They can span weeks',
      color: 'lightgreen',
    },
    {
      start: new Date('2023-01-30'),
      end: new Date('2023-02-03'),
      value:
        'They can span months (click ahead to the next month and this one will still be there)',
      color: 'orange',
    },
  ];
  return (
    <div style={{ maxWidth: '1000px' }}>
      <Calendar date={new Date('2023-01-02')} events={EVENTS} />
    </div>
  );
});

stories.add('Interactive', () =>
  // InteractiveCalendar is stateful sample-implementation that allows for clickable event creation and deletion
  React.createElement(() => <InteractiveCalendar />)
);

stories.add('Custom Theming', () => {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <Calendar
        calendarStyle={{
          backgroundColor: 'rgb(40, 40, 40)',
          secondaryColor: 'grey',
          textColor: 'lightgrey',
          overlapColor: 'rgb(60, 60, 60)',
          hoverColor: 'rgb(0, 79, 250)',
          selectColor: 'rgb(70, 70, 90)',
        }}
      />
    </div>
  );
});

stories.add('Infinity Scroll (experimental)', () =>
  // InteractiveCalendar is stateful sample-implementation that allows for clickable event creation and deletion
  React.createElement(() => <InteractiveCalendar scrollMode />)
);
