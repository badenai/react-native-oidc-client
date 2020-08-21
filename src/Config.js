import Log from './Log';
import { BROWSER_TYPES } from './Constants';
import StateStore from './StateStore';
import ResponseValidator from './ResponseValidator';
import MetadataService from './MetadataService';
import RequestService from './RequestService';
import AuthorizationCodeGrant from './AuthorizationCodeGrant';
import AccessTokenGrant from './AccessTokenGrant';

const OidcMetadataUrlPath = '.well-known/openid-configuration';

const DefaultResponseType = 'id_token';
const DefaultScope = 'openid';
const DefaultStaleStateAge = 60 * 5; // seconds
const DefaultClockSkewInSeconds = 60 * 5;

export default class Config {
    constructor({
        // metadata related
        authority,
        metadataUrl,
        metadata,
        signingKeys,
        // client related
        client_id,
        client_secret,
        response_type = DefaultResponseType,
        scope = DefaultScope,
        redirect_uri,
        post_logout_redirect_uri,
        registration_info,
        browser_type = BROWSER_TYPES.SYSTEMBROWSER,
        // optional protocol
        prompt,
        display,
        max_age,
        ui_locales,
        acr_values,
        resource,
        // behavior flags
        filterProtocolClaims = false,
        loadUserInfo = true,
        staleStateAge = DefaultStaleStateAge,
        clockSkew = DefaultClockSkewInSeconds,
        // other behavior
        ResponseValidatorCtor = ResponseValidator,
        MetadataServiceCtor = MetadataService,
        RequestServiceCtor = RequestService,
        // authorization flow config
        AuthorizationGrantCtor = AuthorizationCodeGrant,
        AccessTokenGrantCtor = AccessTokenGrant,
        // extra query params
        extraQueryParams = {},
        // storage
        storage,
    } = {}) {
        if (!storage)
            throw new Error('Please provide a storage in your config');
        this._authority = authority;
        this._metadataUrl = metadataUrl;
        this._metadata = metadata;
        this._signingKeys = signingKeys;

        this._client_id = client_id;
        this._client_secret = client_secret;
        this._response_type = response_type;
        this._scope = scope;
        this._redirect_uri = redirect_uri;
        this._post_logout_redirect_uri = post_logout_redirect_uri;
        this._registration_info = registration_info;
        this._browser_type = browser_type;

        this._prompt = prompt;
        this._display = display;
        this._max_age = max_age;
        this._ui_locales = ui_locales;
        this._acr_values = acr_values;
        this._resource = resource;

        this._filterProtocolClaims = !!filterProtocolClaims;
        this._loadUserInfo = !!loadUserInfo;
        this._staleStateAge = staleStateAge;
        this._clockSkew = clockSkew;

        this._stateStore = new StateStore(storage);
        this._validator = new ResponseValidatorCtor(this);
        this._metadataService = new MetadataServiceCtor(this);
        this._requestService = new RequestServiceCtor();

        this._authorizationGrant = new AuthorizationGrantCtor(this);
        if (this._authorizationGrant instanceof AuthorizationCodeGrant) {
            this._accessTokenGrant = new AccessTokenGrantCtor(this);
        } else {
            this._accessTokenGrant = null;
        }

        this._extraQueryParams =
            typeof extraQueryParams === 'object' ? extraQueryParams : {};
    }

    toStorageString = () => {
        return JSON.stringify(this, (key, value) => {
            if (
                key !== '' && // skip the root
                !Array.isArray(value) &&
                value instanceof Object
            ) {
                if (key === '_metadata' || key === '_extraQueryParams') {
                    return value;
                }
                return undefined;
            }
            return value;
        });
    };

    static fromStorageString = (configJSON) => {
        const config = JSON.parse(configJSON);
        if (config) {
            return Object.assign(new Config(), config);
        } else {
            Log.debug(
                'fromStorageString no config to restore. We can not continue.'
            );
            throw Error(
                'fromStorageString at least we need a stored config for the Client.'
            );
        }
    };

    // client config
    get client_id() {
        return this._client_id;
    }
    set client_id(value) {
        this._client_id = value;
    }
    get client_secret() {
        return this._client_secret;
    }
    set client_secret(value) {
        this._client_secret = value;
    }
    get response_type() {
        return this._response_type;
    }
    get scope() {
        return this._scope;
    }
    get redirect_uri() {
        return this._redirect_uri;
    }
    get post_logout_redirect_uri() {
        return this._post_logout_redirect_uri;
    }
    get registration_info() {
        return this._registration_info;
    }
    set registration_info(value) {
        this._registration_info = value;
    }
    get browser_type() {
        return this._browser_type;
    }
    set browser_type(value) {
        this._browser_type = value;
    }

    // optional protocol params
    get prompt() {
        return this._prompt;
    }
    get display() {
        return this._display;
    }
    get max_age() {
        return this._max_age;
    }
    get ui_locales() {
        return this._ui_locales;
    }
    get acr_values() {
        return this._acr_values;
    }
    get resource() {
        return this._resource;
    }

    // metadata
    get authority() {
        return this._authority;
    }
    set authority(value) {
        if (!this._authority) {
            // one-time set only
            this._authority = value;
        } else {
            Log.error('authority has already been assigned.');
            throw new Error('authority has already been assigned.');
        }
    }
    get metadataUrl() {
        if (!this._metadataUrl) {
            this._metadataUrl = this.authority;

            if (
                this._metadataUrl &&
                this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0
            ) {
                if (this._metadataUrl[this._metadataUrl.length - 1] !== '/') {
                    this._metadataUrl += '/';
                }
                this._metadataUrl += OidcMetadataUrlPath;
            }
        }

        return this._metadataUrl;
    }

    // settable/cachable metadata values
    get metadata() {
        return this._metadata;
    }
    set metadata(value) {
        this._metadata = value;
    }

    get signingKeys() {
        return this._signingKeys;
    }
    set signingKeys(value) {
        this._signingKeys = value;
    }

    // behavior flags
    get filterProtocolClaims() {
        return this._filterProtocolClaims;
    }
    get loadUserInfo() {
        return this._loadUserInfo;
    }
    get staleStateAge() {
        return this._staleStateAge;
    }
    get clockSkew() {
        return this._clockSkew;
    }

    get stateStore() {
        return this._stateStore;
    }
    get validator() {
        return this._validator;
    }
    get metadataService() {
        return this._metadataService;
    }
    get requestService() {
        return this._requestService;
    }

    // Configured grants
    get authorizationGrant() {
        return this._authorizationGrant;
    }
    get accessTokenGrant() {
        return this._accessTokenGrant;
    }

    // extra query params
    get extraQueryParams() {
        return this._extraQueryParams;
    }
    set extraQueryParams(value) {
        if (typeof value === 'object') {
            this._extraQueryParams = value;
        } else {
            this._extraQueryParams = {};
        }
    }
}
