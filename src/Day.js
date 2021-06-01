import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Event from './Event';
import './App.css';

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
  events,
}) {
  const [hover, setHover] = useState(false);
  const thisMonth = date.getMonth();
  const style = {
    normal: {
      backgroundColor: viewMonth === thisMonth ? 'white' : 'rgb(240,240,240)',
      height: dayHeight,
      color: 'rgb(100,100,100)',
      userSelect: 'none',
    },
    hover: {
      boxShadow: '0 0 0 1px rgb(0, 79, 250)',
    },
    focus: {
      backgroundColor: 'rgb(220, 239, 255)',
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
      <div style={{ padding: '5px' }}>{date.getDate()}</div>
      {/* {events && date.getTime() === events[0].start.getTime() && (
        <Event events={events} width={4} />
      )} */}
    </div>
  );
}

Day.propTypes = {
  viewMonth: PropTypes.number,
  dayHeight: PropTypes.string,
  date: PropTypes.object,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.bool,
  setEndSelected: PropTypes.func,
  highlighting: PropTypes.bool,
  setHighlighting: PropTypes.func,
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
};
