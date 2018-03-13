import { AsyncStorage } from 'react-native';

const timer = {
    setInterval: function(cb, duration) {
        return setInterval(cb, duration);
    },
    clearInterval: function(handle) {
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

    static get storage() {
        if (!testing) {
            return AsyncStorage;
        }
    }

    static get sessionStorage() {
        if (!testing) {
            return AsyncStorage;
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
    static accessTokenKey(authority, client_id) {
        return `at:${authority}:${client_id}`;
    }

    static AUTHORIZATION_FLOWS = {
        AUTHORIZATION_CODE: 'AUTHORIZATION_CODE',
        IMPLICIT: 'IMPLICIT',
        CLIENT_CREDENTIAL: 'CLIENT_CREDENTIAL',
    };
}
