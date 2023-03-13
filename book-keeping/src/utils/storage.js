/**
 * Storage二次封装
 */

import config from '../config';

const useStorage = () => {
    const setItem = (key, val) => {
        let storage = getStorage();
        storage[key] = val;
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    };
    const getItem = key => {
        return getStorage()[key];
    };
    const getStorage = () => {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    };
    const removeItem = key => {
        let storage = getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    };
    const clear = () => {
        window.localStorage.clear();
    };
    return {
        setItem,
        getItem,
        getStorage,
        removeItem,
        clear,
    };
};

export default useStorage;
// export default {
//     setItem(key, val) {
//         let storage = this.getStorage();
//         storage[key] = val;
//         window.localStorage.setItem(config.namespace, JSON.stringify(storage));
//     },
//     getItem(key) {
//         return this.getStorage()[key];
//     },
//     getStorage() {
//         return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
//     },
//     removeItem(key) {
//         let storage = this.getStorage();
//         delete storage[key];
//         window.localStorage.setItem(config.namespace, JSON.stringify(storage));
//     },
//     clear() {
//         window.localStorage.clear();
//     },
// };
