import getWeekDays from '../../utils/getWeekdays';

interface WeekDayCellProps {
    weekday: string;
    dayNumber: number;
    isToday?: boolean;
    isWeekend?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}

function WeekDayCell({
    weekday,
    dayNumber,
    isToday = false,
    isWeekend = false,
    isSelected = false,
    onClick,
}: WeekDayCellProps) {
    return (
        <li
            onClick={!isWeekend ? onClick : undefined}
            className={`
        relative flex flex-col gap-1 p-1 pb-3 text-12 font-semibold items-center flex-1
        ${isWeekend ? 'text-[#94A3B8] cursor-default' : 'cursor-pointer'}
        ${isSelected ? 'text-point' : !isWeekend && 'text-[#0F172A]'}
      `}
        >
            {isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 bg-red-500 rounded-full" />}
            <span className="inline-block">{weekday}</span>
            <span
                className={`
          text-14 size-7 flex items-center justify-center rounded-full
          ${isSelected ? 'bg-point text-white' : ''}
        `}
            >
                {dayNumber}
            </span>
        </li>
    );
}

const WEEKEND_DAYS = ['토', '일'];

interface WeekDayBarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export default function WeekDayBar({ selectedDate, onSelectDate }: WeekDayBarProps) {
    return (
        <ul className="w-full flex items-center justify-center transition-all duration-200 border-b-2 border-[#E2E8F0] px-2">
            {getWeekDays().map((weekday) => (
                <WeekDayCell
                    key={weekday.weekday}
                    weekday={weekday.weekday}
                    dayNumber={weekday.dayNumber}
                    isToday={weekday.isToday}
                    isWeekend={WEEKEND_DAYS.includes(weekday.weekday)}
                    isSelected={weekday.date.toDateString() === selectedDate.toDateString()}
                    onClick={() => onSelectDate(weekday.date)}
                />
            ))}
        </ul>
    );
}
