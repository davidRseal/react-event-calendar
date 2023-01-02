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
        backgroundColor: event.color ? event.color : calendarStyle.eventColor,
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
            height: '100%',
            position: 'relative',
          }}
        >
          {event.value}
        </div>
      )}
    </div>
  );
}

Event.propTypes = {
  // Date range representing this Event
  event: PropTypes.object,
  // whether it should display as selected or not
  selected: PropTypes.bool,
  handleEventClick: PropTypes.func,
  calendarStyle: PropTypes.shape({
    eventColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
};
