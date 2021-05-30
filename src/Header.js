import React from 'react';
import PropTypes from 'prop-types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '75px',
};

export default function Header({ firstDay, setFirstDay }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ padding: '10px' }}>
        <button
          style={buttonStyle}
          onClick={() =>
            setFirstDay(
              new Date(firstDay.getFullYear(), firstDay.getMonth() - 1, 1)
            )
          }
        >
          Previous
        </button>
      </div>
      <div style={{ fontSize: '30px' }}>
        {`${MONTHS[firstDay.getMonth()]} ${firstDay.getFullYear()}`}
      </div>
      <div style={{ padding: '10px' }}>
        <button
          style={buttonStyle}
          onClick={() =>
            setFirstDay(
              new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 1)
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

Header.propTypes = {
  firstDay: PropTypes.object,
  month: PropTypes.number,
  setFirstDay: PropTypes.func,
};
