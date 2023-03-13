import request from '../utils/request';

export default {
    all(param) {
        return request({
            url: '/bills',
            method: 'get',
            data: param,
        });
    },
    add(param) {
        return request({
            url: '/bills',
            method: 'post',
            data: param,
        });
    },
    getByTime(param) {
        return request({
            url: `/bills/t`,
            method: 'post',
            data: param,
        });
    },
    modify(param) {
        return request({
            url: '/bills',
            method: 'put',
            data: param,
        });
    },
    delete(id) {
        return request({
            url: `/bills/${id}`,
            method: 'delete',
        });
    },
    getWeekRank(username) {
        return request({
            url: `/bills/u/${username}`,
            method: 'get',
        });
    },
    getMonthRank(username) {
        return request({
            url: `/bills/month/rank/${username}`,
            method: 'get',
        });
    },
    getYearRank(username) {
        return request({
            url: `/bills/year/rank/${username}`,
            method: 'get',
        });
    },
    getIncomeAndExpensesInMouth(user_id, current) {
        return request({
            url: `/bills/mouth/${current}/${user_id}`,
            method: 'get',
        });
    },
    getWeekTotal(param) {
        return request({
            url: `/bills/week/total`,
            method: 'post',
            data: param,
        });
    },
    getMonthTotal(param) {
        return request({
            url: `/bills/month/total`,
            method: 'post',
            data: param,
        });
    },
    getYearTotal(param) {
        return request({
            url: `/bills/year/total`,
            method: 'post',
            data: param,
        });
    },
};
