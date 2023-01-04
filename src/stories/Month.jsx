import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';
import { getFirstDayOfFirstWeek, DAY, getNumWeeksInView } from './Calendar';

export default function Month({
  firstDay,
  startOfView,
  dayHeight,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  onSelect,
  calendarStyle,
}) {
  const [highlighting, setHighlighting] = useState(false);

  useEffect(() => {
    if (!highlighting && startSelected && endSelected) {
      onSelect(startSelected, endSelected);
    }
  }, [startSelected, endSelected]);

  function getWeek(weekStart) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      let currDate = new Date(weekStart.getTime() + i * DAY);
      days.push(
        <td
          key={'week-column-' + i}
          style={{ width: 100 / 7 + '%', padding: '0px' }}
        >
          <Day
            firstDay={firstDay}
            dayHeight={dayHeight}
            date={currDate}
            startSelected={startSelected}
            setStartSelected={setStartSelected}
            endSelected={endSelected}
            setEndSelected={setEndSelected}
            highlighting={highlighting}
            setHighlighting={setHighlighting}
            calendarStyle={calendarStyle}
          />
        </td>
      );
    }
    return days;
  }

  function getMonth() {
    const firstDayOfFirstWeek = getFirstDayOfFirstWeek(firstDay);
    const numWeeksInView = getNumWeeksInView(firstDayOfFirstWeek, firstDay)
    let weeks = [];
    let weekCounter = 0;
    for (; weekCounter < numWeeksInView; weekCounter++) {
      let currDate = new Date(startOfView.getTime() + weekCounter * 7 * DAY);
      let weeksMonth = currDate.getUTCMonth();
      let weeksYear = currDate.getUTCFullYear();
      weeks.push(<tr key={'month-row-' + weekCounter} data-month={weeksMonth} data-year={weeksYear}>{getWeek(currDate)}</tr>);
    }
    return weeks;
  }

  return (
    <table
      style={{
        backgroundColor: calendarStyle.secondaryColor,
        gridColumn: 1,
        gridRow: 1,
      }}
    >
      <tbody id="week-list">{getMonth()}</tbody>
    </table>
  );
}

Month.propTypes = {
  // the first day of the month. Not necessarily the first day on the calendar because of week overlap
  firstDay: PropTypes.object,
  // the first day of the fully rendered scrollable calendar window
  startOfView: PropTypes.object,
  dayHeight: PropTypes.number,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.object,
  setEndSelected: PropTypes.func,
  onSelect: PropTypes.func,
  calendarStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    textColor: PropTypes.string,
    overlapColor: PropTypes.string,
    hoverColor: PropTypes.string,
    selectColor: PropTypes.string,
  }),
};

Month.defaultProps = {
  date: new Date(),
  dayHeight: '100px',
  clickSelection: false,
};
