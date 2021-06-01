import React from 'react';
import PropTypes from 'prop-types';

export default function EventsOverlay({ events, dayHeight }) {
  return (
    <table
      style={{
        position: 'absolute',
        width: '100%',
        height: '100px',
        backgroundColor: 'rgba(0,0,0,0.25)',
        gridColumn: 1,
        gridRow: 1,
      }}
    >
      <tr>
        <td style={{ width: '28.4%', height: dayHeight, padding: '0px' }}>
          text
        </td>
        <td style={{ width: '71.6%', height: dayHeight, padding: '0px' }}>
          text
        </td>
      </tr>
      <tr>
        <td style={{ width: '71.6%', height: dayHeight, padding: '0px' }}>
          text
        </td>
        <td style={{ width: '28.4%', height: dayHeight, padding: '0px' }}>
          text
        </td>
      </tr>
    </table>
  );
}

EventsOverlay.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  dayHeight: PropTypes.string,
};
