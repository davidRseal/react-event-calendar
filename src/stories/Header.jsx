import React from 'react';
import PropTypes from 'prop-types';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

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

export default function Header({ firstDay, setFirstDay, calendarStyle }) {
  const buttonStyle = {
    cursor: 'pointer',
    minWidth: '50px',
    textAlign: 'center',
    fontSize: '30px',
    marginTop: 'auto',
    marginBottom: 'auto',
    color: calendarStyle.textColor,
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        maxWidth: '318px',
      }}
    >
      <BsChevronLeft
        style={buttonStyle}
        onClick={() =>
          setFirstDay(
            new Date(firstDay.getFullYear(), firstDay.getMonth() - 1, 1)
          )
        }
      />
      <div
        id="title"
        style={{
          width: '218px',
          fontSize: '30px',
          textAlign: 'center',
          color: calendarStyle.textColor,
          userSelect: 'none',
        }}
      >
        {`${MONTHS[firstDay.getMonth()]} ${firstDay.getFullYear()}`}
      </div>
      <BsChevronRight
        style={buttonStyle}
        onClick={() =>
          setFirstDay(
            new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 1)
          )
        }
      />
    </div>
  );
}

Header.propTypes = {
  firstDay: PropTypes.object,
  setFirstDay: PropTypes.func,
  calendarStyle: PropTypes.shape({
    textColor: PropTypes.string,
  }),
};
