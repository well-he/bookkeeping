import axios from 'axios';

export default {
    getOneWord() {
        return axios.get('https://v1.hitokoto.cn?c=k');
    },
};
