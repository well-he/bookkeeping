import request from '../utils/request';

export default {
    findAll() {
        return request({
            url: '/category',
            method: 'get',
        });
    },
    insert(param) {
        return request({
            url: '/category',
            method: 'post',
            data: param,
        });
    },
    update(param) {
        return request({
            url: '/category',
            method: 'put',
            data: param,
        });
    },
    delete(cID) {
        return request({
            url: `/category/${cID}`,
            method: 'delete',
        });
    },
};
