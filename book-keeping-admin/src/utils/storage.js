/**
 * Storage二次封装
 * @author well_wei
 */

import config from '../config';

export default {
    setItem(key, val) {
        let storage = this.getStorage();
        storage[key] = val;
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    getItem(key) {
        return this.getStorage()[key];
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    },
    removeItem(key) {
        let storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clear() {
        window.localStorage.clear();
    },
};
