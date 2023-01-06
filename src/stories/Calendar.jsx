import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Month from './Month';
import EventsOverlay from './EventsOverlay';

// TODO: code quality clean up; these exports shouldn't be visible to "user"
export const DAY = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_BUFFER = 20;

export function getFirstDayOfWeek(date) {
  let firstDayCopy = new Date(date);
  let day = firstDayCopy.getDay();
  let diff = firstDayCopy.getDate() - day;
  let firstDayOfFirstWeek = new Date(firstDayCopy.setDate(diff));
  return firstDayOfFirstWeek;
}

function getFirstDayOfView(firstDayOfFirstWeek, scrollMode) {
  if (scrollMode) {
    return new Date(firstDayOfFirstWeek.getTime() - WEEK_BUFFER * 7 * DAY);
  }
  // if scrolling is disabled the first day of the view is the first day of the first week of the month
  return firstDayOfFirstWeek;
}

export function getNumWeeksInView(
  firstDayOfFirstWeek,
  firstOfMonth,
  scrollMode
) {
  let numWeeksInTargetMonth = 4;
  for (; numWeeksInTargetMonth < 6; numWeeksInTargetMonth++) {
    let currDate = new Date(
      firstDayOfFirstWeek.getTime() + numWeeksInTargetMonth * 7 * DAY
    );
    if (currDate.getMonth() !== firstOfMonth.getMonth()) {
      break;
    }
  }
  if (scrollMode) {
    return numWeeksInTargetMonth + 2 * WEEK_BUFFER;
  }
  return numWeeksInTargetMonth;
}

export default function Calendar({
  date,
  dayHeight,
  events,
  onEventClick,
  onSelect,
  scrollMode,
  calendarStyle,
}) {
  const DEFAULT_NUM_ROWS_VISIBLE = 7;
  const VERTICAL_TABLE_GAP = 2;
  const calendarHeight =
    dayHeight * DEFAULT_NUM_ROWS_VISIBLE +
    (DEFAULT_NUM_ROWS_VISIBLE + 1) * VERTICAL_TABLE_GAP;

  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [startOfView, setStartOfView] = useState(
    getFirstDayOfView(getFirstDayOfWeek(firstDay), scrollMode)
  );
  const [startSelected, setStartSelected] = useState(null);
  const [endSelected, setEndSelected] = useState(null);

  const defaultCalendarStyle = {
    backgroundColor: 'white',
    secondaryColor: 'lightgrey',
    textColor: 'black',
    overlapColor: 'rgb(240,240,240)',
    hoverColor: 'rgb(0, 79, 250)',
    selectColor: 'rgb(220, 239, 255)',
    eventColor: 'rgb(33,150,243)',
    ...calendarStyle,
  };

  function getHeader() {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <td
          key={'week-header-' + i}
          style={{ width: 100 / 7 + '%', padding: '0px' }}
        >
          <div
            style={{
              backgroundColor: defaultCalendarStyle.backgroundColor,
              color: defaultCalendarStyle.textColor,
              display: 'flex',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            {WEEKDAYS[i]}
          </div>
        </td>
      );
    }
    return days;
  }

  // loop through list of weeks and find the ones that intersect with the current viewport
  // then return some date within the month that has the plurality of visible weeks
  function getDateFromMostCurrentlyVisibleMonth() {
    const scrollWindow = document.getElementById('scroll-window');
    const weekList = document.getElementById('week-list')?.children;
    const scrollWindowPosition = scrollWindow.getBoundingClientRect();
    const visibleWeeks = [];

    Array.from(weekList).forEach((element) => {
      const position = element.getBoundingClientRect();
      if (
        !(
          scrollWindowPosition.bottom < position.bottom ||
          scrollWindowPosition.top > position.top
        )
      ) {
        const elementMonth = element.getAttribute('data-month');
        const elementYear = element.getAttribute('data-year');
        visibleWeeks.push({ elementMonth, elementYear });
      }
    });

    // count the number of visible weeks for each month
    // associate each month with it's year. Assume that the same month from different years won't appear twice
    const monthFrequencyMap = new Map();
    const monthsYearMap = new Map();
    visibleWeeks.forEach((week) => {
      const currentCount = monthFrequencyMap.get(week.elementMonth);
      if (currentCount) {
        monthFrequencyMap.set(week.elementMonth, currentCount + 1);
      } else {
        monthFrequencyMap.set(week.elementMonth, 1);
      }
      monthsYearMap.set(week.elementMonth, week.elementYear);
    });

    // find the month with the highest frequency. For ties just use the earlier month
    let pluralityMonth = visibleWeeks[0].elementMonth;
    let currentMax = monthFrequencyMap.get(pluralityMonth);
    monthFrequencyMap.forEach((count, month) => {
      if (count > currentMax) {
        pluralityMonth = month;
        currentMax = count;
      } else if (count === currentMax) {
        if (
          month < pluralityMonth &&
          monthsYearMap.get(month) <= monthsYearMap.get(pluralityMonth)
        ) {
          pluralityMonth = month;
          currentMax = count;
        }
      }
    });
    const yearOfMonth = monthsYearMap.get(pluralityMonth.toString());
    const newTargetDate = new Date(yearOfMonth, pluralityMonth, 1);
    return newTargetDate;
  }

  // prevents further scroll events until the component re-renders and the useEffect has reset the scroll position to center
  const resetInProgress = useRef(false);
  function handleScroll() {
    // TODO: if the user clicks and drags the scroll bar to the fringe it will jump to ludicrous speed
    const scrollWindow = document.getElementById('scroll-window');
    const calendarView = document.getElementById('calendar-view');
    const scrollWindowTopPosition = scrollWindow.scrollTop;
    const scrollWindowHeight = scrollWindow.offsetHeight;
    const totalHeight = calendarView.offsetHeight;
    const scrollWindowCenter = scrollWindowTopPosition + scrollWindowHeight / 2;

    const newTargetDate = getDateFromMostCurrentlyVisibleMonth();
    setFirstDay(newTargetDate);

    if (
      !resetInProgress.current &&
      (scrollWindowCenter > totalHeight - scrollWindowHeight ||
        scrollWindowCenter < scrollWindowHeight)
    ) {
      resetInProgress.current = true;
      setStartOfView(
        getFirstDayOfView(getFirstDayOfWeek(newTargetDate), scrollMode)
      );
    }
  }

  // given any date, set the view window around that date, set the current month to that date,
  // and scroll to the middle
  function resetCalendarView(sampleDate) {
    sampleDate.setDate(1);
    setFirstDay(sampleDate);
    setStartOfView(
      getFirstDayOfView(getFirstDayOfWeek(sampleDate), scrollMode)
    );
  }

  // automatically scroll to the center on mount and whenever the view window changes
  useEffect(() => {
    // TODO: can't put more than 1 Calendar on screen at a time since getElementById just gives the first one
    const scrollWindow = document.getElementById('scroll-window');
    const calendarView = document.getElementById('calendar-view');
    const scrollWindowHeight = scrollWindow.offsetHeight;
    const totalHeight = calendarView.offsetHeight;
    const topOfMiddle = totalHeight / 2 - scrollWindowHeight / 2;
    scrollWindow.scrollTo(0, topOfMiddle);
    resetInProgress.current = false;
  }, [startOfView]);

  return (
    <div
      style={{ backgroundColor: defaultCalendarStyle.backgroundColor }}
      onMouseLeave={() => {
        // purge the highlighting information if the cursor leaves the Calendar
        setStartSelected(null);
        setEndSelected(null);
      }}
    >
      <Header
        firstDay={firstDay}
        resetCalendarView={resetCalendarView}
        calendarStyle={defaultCalendarStyle}
      />
      <div style={{ display: 'grid' }}>
        <table>
          <tbody>
            <tr>{getHeader()}</tr>
          </tbody>
        </table>
      </div>
      <div
        id={'scroll-window'}
        style={{
          height: scrollMode ? calendarHeight + 'px' : undefined,
          overflowY: scrollMode ? 'scroll' : undefined,
          overflowX: 'hidden',
        }}
        onScroll={scrollMode ? () => handleScroll() : undefined}
      >
        <div id={'calendar-view'} style={{ display: 'grid' }}>
          <Month
            firstDay={firstDay}
            startOfView={startOfView}
            startSelected={startSelected}
            setStartSelected={setStartSelected}
            endSelected={endSelected}
            setEndSelected={setEndSelected}
            clickSelection={false}
            dayHeight={dayHeight}
            onSelect={onSelect}
            scrollMode={scrollMode}
            calendarStyle={defaultCalendarStyle}
          />
          {/* prevents the events from very suddenly flashing by while the scroll position is reset */}
          {!resetInProgress.current && (
            <EventsOverlay
              firstDay={firstDay}
              startOfView={startOfView}
              events={events}
              dayHeight={dayHeight}
              onEventClick={onEventClick}
              scrollMode={scrollMode}
              calendarStyle={defaultCalendarStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}

Calendar.propTypes = {
  // sets the default view of the calendar to whichever month contains the given date
  date: PropTypes.object,
  // list of date ranges
  events: PropTypes.arrayOf(
    PropTypes.shape({ start: PropTypes.object, end: PropTypes.object })
  ),
  // sets the height of the grid cells
  dayHeight: PropTypes.number,
  // callback function for whenever an event is clicked
  onEventClick: PropTypes.func,
  // callback function for whenever a mouseUp event occurs
  onSelect: PropTypes.func,
  // enables an infinity scroll
  scrollMode: PropTypes.bool,
  // custom theming object
  calendarStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    textColor: PropTypes.string,
    overlapColor: PropTypes.string,
    hoverColor: PropTypes.string,
    selectColor: PropTypes.string,
    eventColor: PropTypes.string,
  }),
};

Calendar.defaultProps = {
  date: new Date(),
  dayHeight: 100,
  events: [],
  onEventClick: () => {},
  onSelect: () => {},
  scrollMode: false,
};
