import React, { useState, useCallback, memo } from 'react';
import './App.css';
import { getYearMonthDay } from './utils';

const ary7 = new Array(7).fill("");
const ary6 = new Array(6).fill("");

interface TestProps {
  value?: number;
  onChange?: (value: string) => void;
}

interface State {
}

const Test: React.FC<TestProps> = memo(({ value = Date.now(), onChange }) => {
  console.log("render -------");
  const [date, setDate] = useState<Date>(new Date(value));
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const { year, month, day } = getYearMonthDay(date.getTime());
  const currentMonthFirstDay = new Date(year, month, 1);
  const dayOfCurrentMonthFirstDay = currentMonthFirstDay.getDay();
  console.log(dayOfCurrentMonthFirstDay);
  const startDay = new Date(currentMonthFirstDay.getTime() - dayOfCurrentMonthFirstDay * 1000 * 60 * 60 * 24);
  const dates:Date[] = [];
  for (let index = 0; index < 42; index++) {
    dates.push(new Date(startDay.getTime() + 1000 * 60 * 60 * 24 * index));
  }
  return (
    <div>
      <input type="text" value={`${year} - ${month} - ${day}`} />
      {
        contentVisible && (
          <div>
            <div>
              <span>&lt;</span>
              <span>&lt; &lt;</span>
              <span></span>
              <span>&gt;</span>
              <span>&gt; &gt;</span>
            </div>
            <div>
              {
                ary6.map((_, index) => {
                  return (
                    <div>
                      {
                        ary7.map((__, idx) => {
                          const num = index * 7 + idx;
                          console.log(num);
                          
                          const curDate = dates[num]
                          return (
                            <span>{curDate.getDate()}</span>
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
      <Test />
    </>
  );
}

export default App;
