import request from '../utils/request';

export default {
    login(param) {
        return request({
            url: '/users/login',
            method: 'post',
            data: param,
        });
    },
    registry(param) {
        return request({
            url: '/users/registry',
            method: 'post',
            data: param,
        });
    },
    modifyPwd(param) {
        return request({
            url: '/users/password',
            method: 'put',
            data: param,
        });
    },
    modify(param) {
        return request({
            url: '/users',
            method: 'put',
            data: param,
        });
    },
};
