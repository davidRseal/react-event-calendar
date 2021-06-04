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

const buttonStyle = {
  cursor: 'pointer',
  width: '50px',
  textAlign: 'center',
  fontSize: '30px',
  marginTop: 'auto',
  marginBottom: 'auto',
};

export default function Header({ firstDay, setFirstDay }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
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
        style={{
          fontSize: '30px',
          minWidth: '300px',
          textAlign: 'center',
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
  month: PropTypes.number,
  setFirstDay: PropTypes.func,
};
