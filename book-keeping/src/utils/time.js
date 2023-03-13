import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);

export default {
    currentDay() {
        return dayjs().format('YYYY-MM-DD');
    },
    currentTime() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
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
    fotmat(date) {
        return dayjs(date).format('YYYY-MM-DD');
    },
    formatLongTime(date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
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
