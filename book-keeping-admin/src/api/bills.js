import request from '../utils/request';

export default {
    findAll() {
        return request({
            url: '/bills',
            method: 'get',
        });
    },
    findUserBills(username) {
        return request({
            url: `/bills/u/${username}`,
            method: 'get',
        });
    },
    findByDate(param) {
        return request({
            url: '/bills/t',
            method: 'post',
            data: param,
        });
    },
    delete(bill_id) {
        return request({
            url: `/bills/${bill_id}`,
            method: 'delete',
        });
    },
};
