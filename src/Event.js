import React from 'react';
import PropTypes from 'prop-types';

export default function Event({
  event,
  selected,
  handleEventClick,
  calendarStyle,
}) {
  return (
    <div
      onClick={() => handleEventClick(event)}
      style={{
        pointerEvents: 'all',
        backgroundColor: calendarStyle.eventColor,
        boxShadow: selected
          ? 'inset 0 0 0 2px ' + calendarStyle.hoverColor
          : undefined,
        borderRadius: '10px',
        height: '100%',
      }}
    >
      {!!event.value && (
        <div
          style={{
            padding: '0 10px 0 10px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.value}
        </div>
      )}
    </div>
  );
}

Event.propTypes = {
  event: PropTypes.object,
  selected: PropTypes.bool,
  handleEventClick: PropTypes.number,
  calendarStyle: PropTypes.shape({
    eventColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
};
