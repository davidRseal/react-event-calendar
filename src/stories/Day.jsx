import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Day({
  viewMonth,
  dayHeight,
  date,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  highlighting,
  setHighlighting,
  calendarStyle,
}) {
  const [hover, setHover] = useState(false);
  const thisMonth = date.getMonth();
  const style = {
    normal: {
      backgroundColor:
        viewMonth === thisMonth
          ? calendarStyle.backgroundColor
          : calendarStyle.overlapColor,
      height: dayHeight,
      userSelect: 'none',
    },
    hover: {
      boxShadow: '0 0 0 1px ' + calendarStyle.hoverColor,
    },
    focus: {
      backgroundColor: calendarStyle.selectColor,
    },
  };

  function inSelectionRange() {
    if (startSelected === null) {
      return false;
    }
    if (startSelected <= endSelected) {
      return date.getTime() >= startSelected && date.getTime() <= endSelected;
    } else {
      return date.getTime() >= endSelected && date.getTime() <= startSelected;
    }
  }

  return (
    <div
      onMouseDown={() => {
        setHighlighting(true);
        setStartSelected(date);
        setEndSelected(date);
      }}
      onMouseUp={() => {
        setHighlighting(false);
        setEndSelected(date);
      }}
      onMouseEnter={() => {
        setHover(true);
        if (highlighting) {
          setEndSelected(date);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      style={{
        ...style.normal,
        ...(hover ? style.hover : null),
        ...(inSelectionRange() ? style.focus : null),
      }}
    >
      <div
        style={{
          lineHeight: '15px',
          padding: '5px',
          color: calendarStyle.textColor,
        }}
      >
        {date.getDate()}
      </div>
    </div>
  );
}

Day.propTypes = {
  // the month in which this day lies
  viewMonth: PropTypes.number,
  dayHeight: PropTypes.number,
  // Date of this day
  date: PropTypes.object,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.object,
  setEndSelected: PropTypes.func,
  highlighting: PropTypes.bool,
  setHighlighting: PropTypes.func,
  calendarStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    overlapColor: PropTypes.string,
    hoverColor: PropTypes.string,
    selectColor: PropTypes.string,
  }),
};