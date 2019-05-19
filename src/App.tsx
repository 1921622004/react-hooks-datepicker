import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { getYearMonthDay, isSameMonth, isSameDay, getDateFromString } from './utils';

const ary7 = new Array(7).fill("");
const ary6 = new Array(6).fill("");
const strAry = ["日", "一", "二", "三", "四", "五", "六"];

interface TestProps {
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker: React.FC<TestProps> = ({ value = "", onChange = () => { } }) => {
  let initialDate: Date;
  if (value) {
    initialDate = getDateFromString(value);
  } else {
    initialDate = new Date();
  };
  const [date, setDate] = useState<Date>(initialDate);
  const prevValue = useRef<string>(value);

  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const { year, month, day } = getYearMonthDay(date.getTime());
  const [currentMonthFirstDay, setCurrentMonthFirstDay] = useState<Date>(new Date(year, month, 1));
  const { year: chosedYear, month: chosedMonth } = getYearMonthDay(currentMonthFirstDay.getTime());
  const dayOfCurrentMonthFirstDay = currentMonthFirstDay.getDay();
  const startDay = new Date(currentMonthFirstDay.getTime() - dayOfCurrentMonthFirstDay * 1000 * 60 * 60 * 24);
  const dates: Date[] = [];
  for (let index = 0; index < 42; index++) {
    dates.push(new Date(startDay.getTime() + 1000 * 60 * 60 * 24 * index));
  }

  const openContent = useCallback(
    () => setContentVisible(true),
    []
  );
  const closeContent = useCallback(
    () => setContentVisible(false),
    []
  );
  const windowClickhandler = useCallback(
    (ev: MouseEvent) => {
      let target = ev.target as HTMLElement;
      if (wrapper.current && wrapper.current.contains(target)) {
      } else {
        closeContent();
      }
    },
    []
  );
  const dateClickHandler = useCallback(
    (date: Date) => {
      setDate(date);
      const { year, month, day } = getYearMonthDay(date.getTime());
      onChange(`${year}-${month + 1}-${day}`);
      setContentVisible(false);
    },
    [date]
  );
  const prevMonthHandler = useCallback(
    () => {
      setCurrentMonthFirstDay(value => {
        let { year, month } = getYearMonthDay(value.getTime());
        if (month === 0) {
          month = 11;
          year--;
        } else {
          month--;
        }
        return new Date(year, month, 1)
      })
    },
    []
  );
  const nextMonthHandler = useCallback(
    () => {
      setCurrentMonthFirstDay(value => {
        let { year, month } = getYearMonthDay(value.getTime());
        if (month === 11) {
          month = 0;
          year++;
        } else {
          month++;
        };
        return new Date(year, month, 1);
      })
    },
    []
  );
  const prevYearhandler = useCallback(
    () => {
      setCurrentMonthFirstDay(value => {
        let { year, month } = getYearMonthDay(value.getTime());
        return new Date(--year, month, 1)
      })
    },
    []
  );
  const nextYearHandler = useCallback(
    () => {
      setCurrentMonthFirstDay(value => {
        let { year, month } = getYearMonthDay(value.getTime());
        return new Date(++year, month, 1)
      })
    },
    []
  );

  useEffect(
    () => {
      window.addEventListener("click", windowClickhandler);
      return () => {
        window.removeEventListener('click', windowClickhandler);
      }
    },
    []
  );
  useEffect(
    () => {
      if (prevValue.current !== value) {
        let newDate = value ? getDateFromString(value) : new Date();
        setDate(newDate);
        const { year, month } = getYearMonthDay(newDate.getTime());
        setCurrentMonthFirstDay(new Date(year, month, 1))
      }
    },
    [value]
  )

  return (
    <div ref={wrapper} className="wrapper">
      <input type="text" value={`${year} - ${month + 1} - ${day}`} onFocus={openContent} />
      {
        contentVisible && (
          <div className="content">
            <div className="header">
              <span onClick={prevYearhandler}>&lt; &lt;</span>
              <span onClick={prevMonthHandler}>&lt;</span>
              <span>{`${chosedYear} - ${chosedMonth + 1}`}</span>
              <span onClick={nextMonthHandler}>&gt;</span>
              <span onClick={nextYearHandler}>&gt; &gt;</span>
            </div>
            <div className="row">
              {
                strAry.map((item) => {
                  return <span className="item">{item}</span>
                })
              }
            </div>
            <div>
              {
                ary6.map((_, index) => {
                  return (
                    <div key={index} className="row">
                      {
                        ary7.map((__, idx) => {
                          const num = index * 7 + idx;
                          const curDate = dates[num];
                          return (
                            <span
                              className={`item${isSameMonth(curDate, currentMonthFirstDay) ? " bold" : ""}${isSameDay(curDate, new Date()) ? " today" : ""}${isSameDay(curDate, date) ? " chosed" : ""}`}
                              onClick={() => dateClickHandler(curDate)}
                              key={num}
                            >
                              {curDate.getDate()}
                            </span>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
};

const App: React.FC = () => {
  const [value, setValue] = useState<string>("2019-4-10");
  useEffect(
    () => {
      const timer = setTimeout(() => {
        setValue("2019-2-20");
      }, 1000);
      return () => {
        clearTimeout(timer)
      }
    },
    []
  )
  return (
    <>
      <DatePicker value={value} onChange={(val) => console.log(val)} />
    </>
  );
}

export default App;
