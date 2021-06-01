import React from 'react';
import PropTypes from 'prop-types';

// const COLORS = ['lightblue', 'blue'];

export default function Event({ events, width }) {
  return (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        width: (100 * width) / 7 + '%',
        height: '70px',
        backgroundColor: 'lightblue',
        zIndex: 2,
      }}
    />
  );
}

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  width: PropTypes.number,
};
