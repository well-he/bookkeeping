/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'; //防止没有定义
const EnvConfig = {
    dev: {
        baseApi: 'http://192.168.3.4:3001/api',
    },
    prod: {
        baseApi: 'http://8.130.39.147:3001/api',
    },
};

export default {
    env,
    namespace: 'book-keeping',
    ...EnvConfig[env],
};
