const dayjs = require('dayjs');
require('dayjs/locale/zh-cn');

dayjs.locale('zh-cn');

module.exports = {
    now(t = Date.now()) {
        return dayjs(t).format('YYYY-MM-DD HH:mm:ss');
    },
};
