import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';

export default function Day({
  viewMonth,
  date,
  startSelected,
  setStartSelected,
  endSelected,
  setEndSelected,
  highlighting,
  setHighlighting,
}) {
  const [hover, setHover] = useState(false);
  const thisMonth = date.getMonth();
  const style = {
    normal: {
      backgroundColor: viewMonth === thisMonth ? 'white' : 'rgb(240,240,240)',
      height: '100px',
      padding: '5px',
      color: 'rgb(100,100,100)',
      userSelect: 'none',
    },
    hover: {
      backgroundColor: 'rgb(220, 239, 255)',
    },
    focus: {
      backgroundColor: 'rgb(220, 239, 255)',
      outline: '2px solid rgb(44, 209, 255)',
      outlineOffset: '-1px',
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
        ...(inSelectionRange() ? style.hover : null),
      }}
    >
      {date.getDate()}
    </div>
  );
}

Day.propTypes = {
  viewMonth: PropTypes.number,
  date: PropTypes.object,
  startSelected: PropTypes.object,
  setStartSelected: PropTypes.func,
  endSelected: PropTypes.bool,
  setEndSelected: PropTypes.func,
  highlighting: PropTypes.bool,
  setHighlighting: PropTypes.func,
};
