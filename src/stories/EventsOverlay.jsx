import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Event from './Event';
import { DAY, getFirstDayOfWeek, getNumWeeksInView } from './Calendar';

export default function EventsOverlay({
  firstDay,
  startOfView,
  events,
  dayHeight,
  onEventClick,
  calendarStyle,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  function handleEventClick(event) {
    setSelectedEvent(event);
    onEventClick(event);
  }

  function eventsEqual(eventA) {
    return (
      eventA &&
      selectedEvent &&
      eventA.start === selectedEvent.start &&
      eventA.end === selectedEvent.end
    );
  }

  function getEvent(col, index) {
    return (
      <div key={'week-column-' + index}>
        {col.event && (
          <Event
            event={col.event.originalEvent}
            selected={eventsEqual(col.event.originalEvent)}
            handleEventClick={handleEventClick}
            calendarStyle={calendarStyle}
          />
        )}
      </div>
    );
  }

  // return number of days between the date of A and the date of B
  // positive if A comes before B
  // negative if B comes before A
  function getNumDaysBetween(dayA, dayB) {
    const unixDayA = Math.trunc(dayA.getTime() / DAY);
    const unixDayB = Math.trunc(dayB.getTime() / DAY);
    let result = unixDayB - unixDayA;
    return result;
  }

  function buildWeekLayout(currWeekStart, weekEvents) {
    let layout = [];
    let numDays = 0;
    while (weekEvents.length) {
      let currDay = new Date(currWeekStart.getTime());
      let currLayout = [];
      let nextLayer = [];
      while (weekEvents.length) {
        let currEvent = weekEvents.shift();
        if (getNumDaysBetween(currDay, currEvent.displayStart) < 0) {
          nextLayer.push(currEvent);
          continue;
        }
        if (getNumDaysBetween(currDay, currEvent.displayStart) > 0) {
          numDays = getNumDaysBetween(currDay, currEvent.displayStart);
          currLayout.push({ numDays: numDays });
          numDays =
            1 + getNumDaysBetween(currEvent.displayStart, currEvent.displayEnd);
          currLayout.push({ numDays: numDays, event: currEvent });
        } else {
          numDays =
            1 + getNumDaysBetween(currEvent.displayStart, currEvent.displayEnd);
          currLayout.push({ numDays: numDays, event: currEvent });
        }
        currDay.setTime(currEvent.displayEnd.getTime() + DAY);
      }
      let nextWeekStart = new Date(currWeekStart.getTime() + 7 * DAY);
      if (getNumDaysBetween(currDay, nextWeekStart) > 0) {
        numDays = getNumDaysBetween(currDay, nextWeekStart);
        currLayout.push({ numDays: numDays });
      }
      weekEvents = nextLayer;
      layout.push(currLayout);
    }
    return layout;
  }

  function trimThisWeeksEvents(currWeekStart) {
    let nextWeekStart = new Date(currWeekStart.getTime() + 7 * DAY);
    let thisWeeksEvents = events
      .filter((event) => {
        if (event.start <= event.end) {
          return currWeekStart <= event.end && nextWeekStart > event.start;
        } else {
          return currWeekStart <= event.start && nextWeekStart > event.end;
        }
      })
      .sort((a, b) => {
        if (a.start <= a.end && b.start <= b.end) {
          return a.start - b.start;
        } else if (a.end < a.start && b.end < b.start) {
          return a.end - b.end;
        } else if (a.start <= a.end && b.end < b.start) {
          return a.start - b.end;
        } else {
          return a.end - b.start;
        }
      });
    let displayEvents = [];
    thisWeeksEvents.forEach((event) => {
      let displayEvent = {};
      displayEvent.originalEvent = { ...event };
      if (event.start <= event.end) {
        displayEvent.displayStart = new Date(event.start.getTime());
        displayEvent.displayEnd = new Date(event.end.getTime());
        if (event.start < currWeekStart)
          displayEvent.displayStart = new Date(currWeekStart.getTime());
        if (event.end >= nextWeekStart)
          displayEvent.displayEnd = new Date(nextWeekStart.getTime() - DAY);
      } else {
        displayEvent.displayStart = new Date(event.end.getTime());
        displayEvent.displayEnd = new Date(event.start.getTime());
        if (event.end < currWeekStart)
          displayEvent.displayStart = new Date(currWeekStart.getTime());
        if (event.start >= nextWeekStart)
          displayEvent.displayEnd = new Date(nextWeekStart.getTime() - DAY);
      }
      displayEvents.push(displayEvent);
    });
    // displayEvents will have 1 item for every event in a given week,
    // and each item will have the displayStart and displayEnd dates, as
    // well as the originalEvent object.
    // each originalEvent can be broken into one displayEvent for each week it spans
    return displayEvents;
  }

  function buildGridTemplate(weekLayer) {
    let result = '';
    weekLayer.forEach((col) => {
      result += 'minmax(0,' + (100 * col.numDays) / 7 + '%)';
    });
    return result;
  }

  function getWeekLayer(weekLayer) {
    let columns = [];
    weekLayer.forEach((col, index) => {
      columns.push(getEvent(col, index));
    });
    return columns;
  }

  let weekCount = 0;
  function getWeek(currWeekStart) {
    let weekEvents = trimThisWeeksEvents(currWeekStart);
    let weekLayout = buildWeekLayout(currWeekStart, weekEvents);
    let layers = [];
    weekLayout.forEach((layer, index) => {
      let layerTemplate = buildGridTemplate(layer);
      layers.push(
        <div
          key={'week-' + weekCount + '-layer-' + index}
          style={{
            display: 'grid',
            gap: '0px 0px',
            gridTemplateColumns: layerTemplate,
            gridTemplateRows: (dayHeight - 25) / weekLayout.length,
          }}
        >
          {getWeekLayer(layer)}
        </div>
      );
    });
    return (
      <div
        key={'week-' + weekCount++}
        style={{ height: dayHeight, marginTop: '2px' }}
      >
        <div style={{ height: '25px' }} />
        {layers}
      </div>
    );
  }

  function getEventOverlay() {
    const firstDayOfFirstWeek = getFirstDayOfWeek(firstDay);
    const numWeeksInView = getNumWeeksInView(firstDayOfFirstWeek, firstDay);
    let weeks = [];
    for (let i = 0; i < numWeeksInView; i++) {
      let currWeekStart = new Date(startOfView.getTime() + i * 7 * DAY);
      weeks.push(getWeek(currWeekStart));
    }
    return weeks;
  }

  return (
    <div
      style={{
        gridColumn: 1,
        gridRow: 1,
        pointerEvents: 'none',
      }}
    >
      {getEventOverlay()}
    </div>
  );
}

EventsOverlay.propTypes = {
  firstDay: PropTypes.object,
  // the first day of the fully rendered scrollable calendar window
  startOfView: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.number,
  onEventClick: PropTypes.func,
  calendarStyle: PropTypes.shape({
    eventColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
};
