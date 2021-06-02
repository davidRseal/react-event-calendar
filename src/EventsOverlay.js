import React from 'react';
import PropTypes from 'prop-types';

const EVENTS = [
  { start: new Date('2021/05/31'), end: new Date('2021/06/01') },
  { start: new Date('2021/06/03'), end: new Date('2021/06/04') },
];
const DAY = 24 * 60 * 60 * 1000;

export default function EventsOverlay({ weekStart, events, dayHeight }) {
  function colStyle(numDays, hasEvent) {
    return {
      width: (100 * numDays) / 7 + '%',
      padding: '0px',
      backgroundColor: hasEvent ? 'rgba(0,200,200,0.25)' : undefined,
    };
  }

  function event() {
    return <div style={{ height: dayHeight }} />;
  }

  function partitionWeek() {
    let nextWeekStart = new Date(weekStart.getTime() + 7 * DAY);
    let dayCount = 0;
    let layout = [];
    let thisWeeksEvents = EVENTS.filter(
      (event) => weekStart <= event.end && nextWeekStart > event.start
    ).sort((a, b) => a.start < b.start);
    while (dayCount < 7) {
      let currDay = new Date(weekStart.getTime() + dayCount * DAY);
      let currEvent = thisWeeksEvents.splice(0, 1)[0];
      if (currDay.getTime() >= currEvent.start.getTime()) {
        let numDays = 1 + (currEvent.end.getTime() - currDay.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays, hasEvent: true });
      } else {
        let numDays = (currEvent.start.getTime() - currDay.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays, hasEvent: false });
        numDays =
          1 + (currEvent.end.getTime() - currEvent.start.getTime()) / DAY;
        numDays = numDays > 7 - dayCount ? 7 - dayCount : numDays;
        dayCount += numDays;
        layout.push({ numDays: numDays, hasEvent: true });
      }
      if (thisWeeksEvents.length === 0) {
        let numDays = 7 - dayCount;
        layout.push({ numDays: numDays, hasEvent: false });
        dayCount = 7;
      }
    }
    return layout;
  }

  function getWeek() {
    let weekLayout = partitionWeek();
    let columns = [];
    weekLayout.forEach((col) => {
      columns.push(
        <td style={colStyle(col.numDays, col.hasEvent)}>{event()}</td>
      );
    });
    return (
      <table
        cellSpacing="1"
        cellPadding="0"
        style={{ width: '100%', paddingTop: '0px' }}
      >
        <tr>{columns}</tr>
      </table>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        gridColumn: 1,
        gridRow: 1,
      }}
    >
      {getWeek()}
      {/* <table
        cellSpacing="1"
        cellPadding="0"
        style={{ width: '100%', paddingTop: '0px' }}
      >
        <tr>
          <td style={colStyle(2, true)}>{event()}</td>
          <td style={colStyle(5, true)}>{event()}</td>
        </tr>
      </table>
      <table
        cellSpacing="1"
        cellPadding="0"
        style={{ width: '100%', paddingTop: '0px' }}
      >
        <tr>
          <td style={colStyle(5, true)}>{event()}</td>
          <td style={colStyle(2, true)}>{event()}</td>
        </tr>
      </table>
      <table
        cellSpacing="1"
        cellPadding="0"
        style={{ width: '100%', paddingTop: '0px' }}
      >
        <tr>
          <td style={colStyle(5)}>{event()}</td>
          <td style={colStyle(2, true)}>{event()}</td>
        </tr>
      </table>
      <table
        cellSpacing="1"
        cellPadding="0"
        style={{ width: '100%', paddingTop: '0px' }}
      >
        <tr>
          <td style={colStyle(2)}>{event()}</td>
          <td style={colStyle(5, true)}>{event()}</td>
        </tr>
      </table> */}
    </div>
  );
}

EventsOverlay.propTypes = {
  weekStart: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.string,
};
