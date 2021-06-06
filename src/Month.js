import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Day from './Day';

const DAY = 24 * 60 * 60 * 1000;

export default function Month({
  firstDay,
  dayHeight,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  onSelect,
  setNumWeeksInView,
  calendarStyle,
}) {
  const [highlighting, setHighlighting] = useState(false);
  let numWeeksInView = 0;

  useEffect(() => {
    if (!highlighting && startSelected && endSelected) {
      onSelect(startSelected, endSelected);
    }
  }, [startSelected, endSelected]);

  useEffect(() => {
    //just to avoid updating Calendar's state while this component renders
    setNumWeeksInView(numWeeksInView);
  }, []);

  function getSunday() {
    let firstDayCopy = new Date(firstDay);
    let day = firstDayCopy.getDay();
    let diff = firstDayCopy.getDate() - day;
    return new Date(firstDayCopy.setDate(diff));
  }

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
            viewMonth={firstDay.getMonth()}
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
    let weekStart = getSunday();
    let weeks = [];
    let i = 0;
    for (; i < 6; i++) {
      let currDate = new Date(weekStart.getTime() + i * 7 * DAY);
      if (i > 4 && currDate.getMonth() !== firstDay.getMonth()) {
        break;
      }
      weeks.push(<tr key={'month-row-' + i}>{getWeek(currDate)}</tr>);
    }
    numWeeksInView = i;
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
      <tbody>{getMonth()}</tbody>
    </table>
  );
}

Month.propTypes = {
  firstDay: PropTypes.object,
  dayHeight: PropTypes.number,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.object,
  setEndSelected: PropTypes.func,
  clickSelection: PropTypes.bool,
  onSelect: PropTypes.func,
  setNumWeeksInView: PropTypes.func,
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
