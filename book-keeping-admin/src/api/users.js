import request from '../utils/request';
export default {
    login(param) {
        return request({
            url: '/admin/login',
            method: 'post',
            data: param,
        });
    },
    registry(param) {
        return request({
            url: '/admin/registry',
            method: 'post',
            data: param,
        });
    },
    allUser(param) {
        return request({
            url: '/users',
            method: 'get',
            data: param,
        });
    },
    findByUserName(username) {
        return request({
            url: `/users/${username}`,
            method: 'get',
        });
    },
    delete(user_id) {
        return request({
            url: `/users/${user_id}`,
            method: 'delete',
        });
    },
    addNewUser(param) {
        return request({
            url: '/users/registry',
            method: 'post',
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
