import Log from './Log';

const OidcScope = 'openid';

export default class AccessToken {
    constructor(values) {
        this.error = values.error;
        this.error_description = values.error_description;
        this.error_uri = values.error_uri;

        this.state = values.state;
        this.id_token = values.id_token;
        this.session_state = values.session_state;
        this.access_token = values.access_token;
        this.refresh_token = values.refresh_token;
        this.token_type = values.token_type;
        this.scope = values.scope;
        this.profile = values.profile; // will be set from ResponseValidator

        let expires_in = parseInt(values.expires_in);
        if (typeof expires_in === 'number' && expires_in > 0) {
            let now = parseInt(Date.now() / 1000);
            this.expires_at = now + expires_in;
        }
    }

    get expires_in() {
        if (this.expires_at) {
            let now = parseInt(Date.now() / 1000);
            return this.expires_at - now;
        }
        return undefined;
    }

    get expired() {
        let expires_in = this.expires_in;
        if (expires_in !== undefined) {
            return expires_in <= 0;
        }
        return undefined;
    }

    get scopes() {
        return (this.scope || '').split(' ');
    }

    get isOpenIdConnect() {
        return this.scopes.indexOf(OidcScope) >= 0 || !!this.id_token;
    }

    toStorageString() {
        Log.debug('AccessToken.toStorageString');
        if (this.error) {
            return JSON.stringify({
                error: this.error,
                error_description: this.error_description,
                error_uri: this.error_uri,
            });
        } else {
            return JSON.stringify({
                id_token: this.id_token,
                session_state: this.session_state,
                access_token: this.access_token,
                refresh_token: this.refresh_token,
                token_type: this.token_type,
                scope: this.scope,
                profile: this.profile,
                expires_at: this.expires_at,
            });
        }
    }

    static fromStorageString(storageString) {
        Log.debug('AccessToken.fromStorageString');
        return new AccessToken(JSON.parse(storageString));
    }
}
