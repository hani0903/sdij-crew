import { WEEKDAYS } from '../constants/week';

const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0(일) ~ 6(토)

    return WEEKDAYS[currentDay];
};

export default getCurrentWeekDays;
