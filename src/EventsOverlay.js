import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

  function event(col, index) {
    return (
      <td
        key={'week-column-' + index}
        style={{
          width: (100 * col.numDays) / 7 + '%',
          padding: '0px',
          height: dayHeight,
        }}
      >
        <div style={{ height: '50%' }} />
        <div
          onClick={col.event ? () => handleEventClick(col.event) : undefined}
          style={{
            pointerEvents: col.event ? 'all' : 'none',
            backgroundColor: col.event ? calendarStyle.eventColor : undefined,
            boxShadow:
              col.event && eventsEqual(selectedEvent, col.event)
                ? 'inset 0 0 0 2px ' + calendarStyle.hoverColor
                : undefined,
            borderRadius: '10px',
            height: '50%',
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
          }}
        >
          {col.event && !!col.event.value && (
            <div
              style={{
                padding: '0 10px 0 10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {col.event.value}
            </div>
          )}
        </div>
      </td>
    );
  }

  function partitionWeek(currWeekStart) {
    if (events.length === 2) {
      console.log('do nothing');
    }
    let nextWeekStart = new Date(currWeekStart.getTime() + 7 * DAY);
    let dayCount = 0;
    let layout = [];
    let thisWeeksEvents = events
      .filter(
        (event) => currWeekStart <= event.end && nextWeekStart > event.start
      )
      .sort((a, b) => a.start - b.start);
    while (dayCount < 7) {
      if (thisWeeksEvents.length === 0) {
        let numDays = 7 - dayCount;
        layout.push({ numDays: numDays });
        dayCount = 7;
        break;
      }
      let currDay = new Date(currWeekStart.getTime() + dayCount * DAY);
      let currEvent = thisWeeksEvents.splice(0, 1)[0];
      if (currDay.getTime() >= currEvent.start.getTime()) {
        let numDays = 1 + (currEvent.end.getTime() - currDay.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays, event: currEvent });
      } else {
        let numDays = (currEvent.start.getTime() - currDay.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays });
        numDays =
          1 + (currEvent.end.getTime() - currEvent.start.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays, event: currEvent });
      }
    }
    return layout;
  }

  function getWeek(currWeekStart) {
    let weekLayout = partitionWeek(currWeekStart);
    let columns = [];
    weekLayout.forEach((col, index) => {
      columns.push(event(col, index));
    });
    return columns;
  }

  function getEventOverlay() {
    let weeks = [];
    for (let i = 0; i < numWeeksInView; i++) {
      let currWeekStart = new Date(weekStart.getTime() + i * 7 * DAY);
      weeks.push(
        <table
          cellSpacing="1"
          cellPadding="0"
          style={{ width: '100%', paddingTop: '0px', tableLayout: 'fixed' }}
          key={'event-week-' + i}
        >
          <tbody>
            <tr>{getWeek(currWeekStart)}</tr>
          </tbody>
        </table>
      );
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
  dayHeight: PropTypes.string,
  numWeeksInView: PropTypes.number,
  onEventClick: PropTypes.func,
  calendarStyle: PropTypes.shape({
    eventColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
};
