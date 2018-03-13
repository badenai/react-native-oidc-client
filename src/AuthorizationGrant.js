import Log from './Log';

export default class AuthorizationGrant {
    constructor(config) {
        Log.debug('create AuthorizationGrant');

        this.config = config;
    }

    async prepare() {
        throw new Error('AuthorizeGrant prepare has to be implemented.');
    }

    async request() {
        throw new Error('AuthorizeGrant request has to be implemented.');
    }

    cleanRequest(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object')
                this.cleanRequest(obj[key]);
            else if (obj[key] == null) delete obj[key];
        });
        return obj;
    }

    isOidc(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === 'id_token' || item === 'code';
        });
        return !!result[0];
    }

    isOAuth(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === 'token';
        });
        return !!result[0];
    }

    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
}
