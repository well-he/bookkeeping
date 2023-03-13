import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(arraySupport);
dayjs.extend(weekday);
dayjs().weekday(7);

export default {
    currentDay() {
        return dayjs().format('YYYY-MM-DD');
    },
    currentTime() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss ') + this.getWeek();
    },
    array2time(arr) {
        return dayjs(arr.join('/')).format('YYYY-MM-DD');
    },
    time2array() {
        return dayjs().format('YYYY-MM-DD').split('-');
    },
    getDayofMouth() {
        return dayjs(this.currentDay()).daysInMonth();
    },
    format(date) {
        return dayjs(date).format('YYYY-MM-DD');
    },
    formatLongTime(date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    getWeek() {
        const datas = dayjs().day();
        const week = ['日', '一', '二', '三', '四', '五', '六'];
        return '星期' + week[datas];
    },
};

const getDays = () => {
    const d = timeUtil.getDayofMouth();
    for (let i = 1; i <= d; i++) {
        if (i % 5 == 0) {
            xData.value.push(i + '号');
        }
    }
};
