import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Event from './Event';

const DAY = 24 * 60 * 60 * 1000;

export default function EventsOverlay({
  weekStart,
  events,
  dayHeight,
  numWeeksInView,
  onEventClick,
  calendarStyle,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  function handleEventClick(event) {
    setSelectedEvent(event);
    onEventClick(event);
  }

  function eventsEqual(eventA, eventB) {
    return (
      eventA &&
      eventB &&
      eventA.start === eventB.start &&
      eventA.end === eventB.end
    );
  }

  function getEvent(col, index) {
    return (
      <div key={'week-column-' + index}>
        {col.event && (
          <Event
            event={col.event.originalEvent}
            selected={eventsEqual(col.event.originalEvent, selectedEvent)}
            handleEventClick={handleEventClick}
            calendarStyle={calendarStyle}
          />
        )}
      </div>
    );
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
        if (currEvent.start.getTime() < currDay.getTime()) {
          nextLayer.push(currEvent);
          continue;
        }
        if (currDay.getTime() < currEvent.start.getTime()) {
          numDays = (currEvent.start.getTime() - currDay.getTime()) / DAY;
          currLayout.push({ numDays: numDays });
          numDays =
            1 + (currEvent.end.getTime() - currEvent.start.getTime()) / DAY;
          currLayout.push({ numDays: numDays, event: currEvent });
        } else {
          numDays =
            1 + (currEvent.end.getTime() - currEvent.start.getTime()) / DAY;
          currLayout.push({ numDays: numDays, event: currEvent });
        }
        currDay.setTime(currEvent.end.getTime() + DAY);
      }
      let nextWeekStart = new Date(currWeekStart.getTime() + 7 * DAY);
      if (currDay.getTime() < nextWeekStart.getTime()) {
        numDays = (nextWeekStart.getTime() - currDay.getTime()) / DAY;
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
      .filter(
        (event) => currWeekStart <= event.end && nextWeekStart > event.start
      )
      .sort((a, b) => a.start - b.start);
    let eventsCopy = thisWeeksEvents.map((event) => ({ ...event }));
    eventsCopy.forEach((trimmedEvent) => {
      trimmedEvent.originalEvent = { ...trimmedEvent };
      if (trimmedEvent.start < currWeekStart)
        trimmedEvent.start = new Date(currWeekStart.getTime());
      if (trimmedEvent.end >= nextWeekStart)
        trimmedEvent.end = new Date(nextWeekStart.getTime() - DAY);
    });
    return eventsCopy;
  }

  function buildGridTemplate(weekLayer) {
    let result = '';
    weekLayer.forEach((col) => (result += (100 * col.numDays) / 7 + '% '));
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
            gridTemplateRows: (dayHeight * 0.75) / weekLayout.length,
          }}
        >
          {getWeekLayer(layer)}
        </div>
      );
    });
    return (
      <div
        key={'week-' + weekCount++}
        style={{ height: dayHeight, paddingTop: '2px' }}
      >
        <div style={{ height: dayHeight / 4 }} />
        {layers}
      </div>
    );
  }

  function getEventOverlay() {
    let weeks = [];
    for (let i = 0; i < numWeeksInView; i++) {
      let currWeekStart = new Date(weekStart.getTime() + i * 7 * DAY);
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
  weekStart: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.number,
  numWeeksInView: PropTypes.number,
  onEventClick: PropTypes.func,
  calendarStyle: PropTypes.shape({
    eventColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
};
