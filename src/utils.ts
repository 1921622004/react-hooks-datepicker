
interface Res {
    year: number;
    month: number;
    day: number;
}

export const getYearMonthDay = (value: number) => {
    const date = new Date(value);
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay()
    }    
}