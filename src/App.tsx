import React, {useState, useCallback, memo} from 'react';
import logo from './logo.svg';
import './App.css';
import { getYearMonthDay } from './utils';

interface TestProps {
  value?:number;
  onChange?: (value:string) => void;
}

interface State {
}

const Test:React.FC<TestProps> = memo(({value = Date.now(), onChange}) => {
  console.log("render -------");
  const [date, setDate] = useState<Date>(new Date(value));
  const { year, month, day } = getYearMonthDay(date.getTime());
  console.log(year, month, day);
  
  return (
    <div>
      <input type="text" value={`${year} - ${month} - ${day}`} />
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
