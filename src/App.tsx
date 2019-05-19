import React, { useState, useCallback, memo, useEffect, useRef, cloneElement } from 'react';
import './App.css';
import { getYearMonthDay, isSameMonth, isSameDay } from './utils';

const ary7 = new Array(7).fill("");
const ary6 = new Array(6).fill("");
const strAry = ["日","一","二","三","四","五","六"];

interface TestProps {
  value?: number;
  onChange?: (value: string) => void;
}

const Test: React.FC<TestProps> = memo(({ value = Date.now(), onChange = () => { } }) => {
  console.log("render -------");
  const [date, setDate] = useState<Date>(new Date(value));
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const wrapper = useRef<HTMLDivElement>(null);
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
      onChange(`${year}-${month}-${day}`);
      setContentVisible(false);
    },
    [date]
  )
  useEffect(
    () => {
      window.addEventListener("click", windowClickhandler);
      return () => {
        window.removeEventListener('click', windowClickhandler);
      }
    },
    []
  )
  const { year, month, day } = getYearMonthDay(date.getTime());
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfCurrentMonthFirstDay = currentMonthFirstDay.getDay();
  console.log(dayOfCurrentMonthFirstDay);
  const startDay = new Date(currentMonthFirstDay.getTime() - dayOfCurrentMonthFirstDay * 1000 * 60 * 60 * 24);
  const dates: Date[] = [];
  for (let index = 0; index < 42; index++) {
    dates.push(new Date(startDay.getTime() + 1000 * 60 * 60 * 24 * index));
  }
  return (
    <div ref={wrapper}>
      <input type="text" value={`${year} - ${month + 1} - ${day}`} onFocus={openContent} />
      {
        contentVisible && (
          <div className="content">
            <div className="header">
              <span>&lt;</span>
              <span>&lt; &lt;</span>
              <span></span>
              <span>&gt;</span>
              <span>&gt; &gt;</span>
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
                          const curDate = dates[num]
                          return (
                            <span
                              className={`item${isSameMonth(curDate, currentMonthFirstDay) ? " bold": ""}${isSameDay(curDate, new Date()) ? " today" : ""}`}
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
});

const App: React.FC = () => {

  return (
    <>
      <Test onChange={(val) => console.log(val)} />
    </>
  );
}

export default App;
