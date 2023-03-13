/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'; //防止没有定义
const EnvConfig = {
    dev: {
        baseApi: 'http://localhost:3001/api',
    },
    prod: {
        baseApi: 'https://api.wellcoding.cn/api',
    },
};

export default {
    env,
    namespace: 'bk-admin',
    ...EnvConfig[env],
};
