import Log from './Log';
import UrlUtility from './UrlUtility';
import AuthorizeState from './AuthorizationState';

export default class AuthorizeRequest {
    constructor(
        config,
        {
            response_type,
            scope,
            redirect_uri,
            state,
            prompt,
            display,
            max_age,
            ui_locales,
            id_token_hint,
            login_hint,
            acr_values,
            resource,
            request,
            request_uri,
            extraQueryParams,
        } = {},
        stateStore = undefined
    ) {
        Log.debug('Client.createAuthorizeRequest');

        if (!config) {
            Log.error('No config supplied to AuthorizeRequest');
            throw new Error('no config');
        }
        this.config = config;

        let client_id = this._config.client_id;
        response_type = response_type || this._config.response_type;
        scope = scope || this._config.scope;
        redirect_uri = redirect_uri || this._config.redirect_uri;

        // id_token_hint, login_hint aren't allowed on _config
        prompt = prompt || this._config.prompt;
        display = display || this._config.display;
        max_age = max_age || this._config.max_age;
        ui_locales = ui_locales || this._config.ui_locales;
        acr_values = acr_values || this._config.acr_values;
        resource = resource || this._config.resource;
        extraQueryParams = extraQueryParams || this._config.extraQueryParams;

        let authority = this._config.authority;

        return this._config._metadataService
            .getAuthorizationEndpoint()
            .then(url => {
                Log.debug('Received authorization endpoint', url);

                this.buildRequest({
                    url,
                    client_id,
                    redirect_uri,
                    response_type,
                    scope,
                    state,
                    authority,
                    prompt,
                    display,
                    max_age,
                    ui_locales,
                    id_token_hint,
                    login_hint,
                    acr_values,
                    resource,
                    request,
                    request_uri,
                    extraQueryParams,
                });

                var authorizeState = this.state;
                stateStore = stateStore || this._config.stateStore;
                if (stateStore) {
                    return stateStore
                        .set(
                            authorizeState.id,
                            authorizeState.toStorageString()
                        )
                        .then(() => {
                            Log.debug('Saving signin state successful.');
                            return this;
                        });
                }
                return this;
            });
    }

    buildRequest = ({
        // mandatory
        url,
        client_id,
        redirect_uri,
        response_type,
        scope,
        authority,
        // optional
        state,
        prompt,
        display,
        max_age,
        ui_locales,
        id_token_hint,
        login_hint,
        acr_values,
        resource,
        request,
        request_uri,
        extraQueryParams,
    }) => {
        if (!url) {
            Log.error('No url passed to AuthorizeRequest');
            throw new Error('url');
        }
        if (!client_id) {
            Log.error('No client_id passed to AuthorizeRequest');
            throw new Error('client_id');
        }
        if (!redirect_uri) {
            Log.error('No redirect_uri passed to AuthorizeRequest');
            throw new Error('redirect_uri');
        }
        if (!response_type) {
            Log.error('No response_type passed to AuthorizeRequest');
            throw new Error('response_type');
        }
        if (!scope) {
            Log.error('No scope passed to AuthorizeRequest');
            throw new Error('scope');
        }
        if (!authority) {
            Log.error('No authority passed to AuthorizeRequest');
            throw new Error('authority');
        }

        let oidc = AuthorizeRequest.isOidc(response_type);
        this.state = new AuthorizeState({
            nonce: oidc,
            state,
            client_id,
            authority,
        });

        url = UrlUtility.addQueryParam(url, 'client_id', client_id);
        url = UrlUtility.addQueryParam(url, 'redirect_uri', redirect_uri);
        url = UrlUtility.addQueryParam(url, 'response_type', response_type);
        url = UrlUtility.addQueryParam(url, 'scope', scope);

        url = UrlUtility.addQueryParam(url, 'state', this.state.id);
        if (oidc) {
            url = UrlUtility.addQueryParam(url, 'nonce', this.state.nonce);
        }

        var optional = {
            prompt,
            display,
            max_age,
            ui_locales,
            id_token_hint,
            login_hint,
            acr_values,
            resource,
            request,
            request_uri,
        };
        for (let key in optional) {
            if (optional[key]) {
                url = UrlUtility.addQueryParam(url, key, optional[key]);
            }
        }

        for (let key in extraQueryParams) {
            url = UrlUtility.addQueryParam(url, key, extraQueryParams[key]);
        }

        this.url = url;
    };

    static isOidc(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === 'id_token';
        });
        return !!result[0];
    }

    static isOAuth(response_type) {
        var result = response_type.split(/\s+/g).filter(function(item) {
            return item === 'token';
        });
        return !!result[0];
    }

    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }

    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
}
