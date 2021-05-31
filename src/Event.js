import React from 'react';
import PropTypes from 'prop-types';

// const COLORS = ['lightblue', 'blue'];

export default function Event({ events }) {
  function getEvents() {
    let eventTiles = [];
    let height = 100 / events.length + '%';
    for (let i = 0; i < events.length; i++) {
      //   let color = COLORS[i];
      eventTiles.push(
        <div
          style={{
            backgroundColor: 'lightblue',
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
            height: height,
          }}
        ></div>
      );
    }

    return eventTiles;
  }

  return getEvents();
}

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
};
