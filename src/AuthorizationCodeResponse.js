import UrlUtility from './UrlUtility';

const OidcScope = 'openid';

export default class AuthorizationCodeResponse {
    constructor(values) {
        this.error = values.error;
        this.error_description = values.error_description;
        this.error_uri = values.error_uri;

        this.state = values.state;
        this.code = values.code;
        this.scope = values.scope;
        this.iss = values.iss;

        if (!this.code) {
            throw Error('AuthorizationCodeResponse does not contain code');
        }
    }

    get scopes() {
        return (this.scope || '').split(' ');
    }

    get isOpenIdConnect() {
        return this.scopes.indexOf(OidcScope) >= 0;
    }
}
