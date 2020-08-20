const timer = {
    setInterval: function (cb, duration) {
        return setInterval(cb, duration);
    },
    clearInterval: function (handle) {
        return clearInterval(handle);
    },
};

let testing = false;
let request = null;

export default class Global {
    static _testing() {
        testing = true;
    }

    static get location() {
        if (!testing) {
            return location;
        }
    }

    static get timer() {
        if (!testing) {
            return timer;
        }
    }

    static get storeKeyPrefix() {
        return 'oidc.';
    }
    static get configKey() {
        return 'CONFIG';
    }
    static get stateKey() {
        return 'STATE.';
    }
    static accessTokenKey(authority) {
        return `at:${authority}`;
    }
}
