import request from '../utils/request';

export default {
    all(param) {
        return request({
            url: '/category',
            method: 'get',
            data: param,
        });
    },
    findById(param) {
        return request({
            url: `'/category/${param.categrayId}`,
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
    modify(param) {
        return request({
            url: '/category',
            method: 'put',
            data: param,
        });
    },
};
