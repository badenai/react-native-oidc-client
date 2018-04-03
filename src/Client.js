import Log from './Log';
import Global from './Global';
import Config from './Config';
import ErrorResponse from './ErrorResponse';
import RequestHandler from './RequestHandler';
import Token from './Token';
import EndSessionRequest from './EndSessionRequest';
import SignoutResponse from './SignoutResponse';
import AuthorizationState from './AuthorizationState';
import State from './State';
import StateStore from './StateStore';
import AuthorizationCodeResponse from './AuthorizationCodeResponse';
import UrlUtility from './UrlUtility';
import AuthorizationCodeGrant from './AuthorizationCodeGrant';
import AccessTokenGrant from './AccessTokenGrant';
import RedirectNavigator from './RedirectNavigator';
import RefreshTokenService from './RefreshTokenService';
import ImplicitGrant from './ImplicitGrant';

Log.logger = console;
Log.level = 4;

export default class Client {
    constructor(config = {}) {
        if (config instanceof Config) {
            this._config = config;
        } else {
            this._config = new Config(config);
        }
        this._navigator = new RedirectNavigator();
        this._refreshTokenService = new RefreshTokenService(this.config);
    }

    get navigator() {
        return this._navigator;
    }
    get stateStore() {
        return this.config.stateStore;
    }
    get validator() {
        return this.config.validator;
    }
    get metadataService() {
        return this.config.metadataService;
    }
    get refreshTokenService() {
        return this._refreshTokenService;
    }
    get config() {
        return this._config;
    }
    get authorizationGrant() {
        return this.config.authorizationGrant;
    }
    get accessTokenGant() {
        return this.config.accessTokenGant;
    }

    get waitForAuthorization() {
        return this._waitForAuthorization;
    }
    set waitForAuthorization(resolver) {
        this._waitForAuthorization = resolver;
    }

    async authorize(authorizationInfo) {
        const authorizationCodeFlow = RequestHandler.identifyAuthenticationRequest(
            this.config
        );

        if (
            authorizationCodeFlow ===
                Global.AUTHORIZATION_FLOWS.AUTHORIZATION_CODE ||
            authorizationCodeFlow === Global.AUTHORIZATION_FLOWS.IMPLICIT
        ) {
            Log.debug(`Client.authorizationGrant`);
            await this.authorizationGrant.prepare(authorizationInfo);
            Log.debug(`Call authorize with ${this.authorizationGrant.url}`);
            await this.store();
            await this.authorizationGrant.request();
            return new Promise(resolve => {
                this.waitForAuthorization = resolve;
            });
        } else if (
            authorizationCodeFlow ===
            Global.AUTHORIZATION_FLOWS.CLIENT_CREDENTIAL
        ) {
            throw new Error(
                `Client.authorize ClientCredential flow is currently not supported.`
            );
        } else {
            throw new Error(`Client.authorize unknown flow.`);
        }
    }

    async refresh() {
        const token = await this.getToken();
        if (token) {
            if (token.refresh_token) {
                let refresh_token = await this.refreshTokenService.refresh(
                    token
                );
                const updatedToken = await this.validator.validateRefreshResponse(
                    token,
                    refresh_token
                );
                await this.storeToken(updatedToken);
                return updatedToken;
            } else {
                Log.debug(`Client.refresh no refresh token.`);
                return Promise.reject(`Client.refresh no refresh token.`);
            }
        } else {
            Log.debug(`Client.refresh no access token to refresh.`);
            return Promise.reject(`Client.refresh no access token to refresh.`);
        }
    }

    handleRedirect(url) {
        return new Promise(async (resolve, reject) => {
            Log.debug(`Client.handleResponse response url ${url}`);
            let tokenResponse;
            const values = UrlUtility.parseUrlFragment(url, '?');

            // this checks the state value of the response
            // if this fails the request state does not match the response state
            const authorizationStateString = await this.stateStore.remove(
                values.state
            );
            const authorizationState = AuthorizationState.fromStorageString(
                authorizationStateString
            );

            if (authorizationState) {
                if (
                    authorizationState.authorization_flow ===
                    Global.AUTHORIZATION_FLOWS.AUTHORIZATION_CODE
                ) {
                    const authorizationCodeResponse = new AuthorizationCodeResponse(
                        values
                    );
                    const accessTokenGrant = new AccessTokenGrant(this.config);
                    await accessTokenGrant.prepare(
                        authorizationCodeResponse.code
                    );
                    Log.debug(
                        `Call token request with ${accessTokenGrant.url}`
                    );
                    const responseJson = await accessTokenGrant.request();
                    if (responseJson) {
                        const response = await responseJson.json();
                        tokenResponse = await this.handleTokenResponse(
                            authorizationState,
                            response
                        );
                    } else {
                        throw new Error(
                            `Client.handleRedirect no valid token response for authorization flow.`
                        );
                    }
                }
                if (
                    authorizationState.authorization_flow ===
                    Global.AUTHORIZATION_FLOWS.IMPLICIT
                ) {
                    tokenResponse = await this.handleTokenResponse(
                        authorizationState,
                        values
                    );
                }
                if (
                    authorizationState.authorization_flow ===
                    Global.AUTHORIZATION_FLOWS.CLIENT_CREDENTIAL
                ) {
                    throw Error(
                        `Client.handleRedirect ClientCredential flow is currently not supported.`
                    );
                }
            } else {
                Log.error('Invalid state.');
                return reject(new Error('Invalid state.'));
            }
            return this.waitForAuthorization(tokenResponse);
        });
    }

    async handleTokenResponse(authorizationState, response) {
        Log.debug(
            `Client.handleAuthenticationResponse ${JSON.stringify(response)}`
        );

        let token = new Token(response);
        Log.debug('Received state from storage; validating response');
        try {
            token = await this.validator.validateAuthorizationResponse(
                authorizationState,
                token
            );
            await this.storeToken(token);
        } catch (err) {
            Log.debug(
                `Client.handleTokenResponse validation of access token failed.`,
                err
            );
        }
        return token;
    }

    async endSession(id_token) {
        Log.debug('Client.endSession');

        const endSessionRequest = new EndSessionRequest(this.config);
        await endSessionRequest.prepare(id_token);
        const response = await endSessionRequest.request();
        Log.debug('Client.endSession RESPONSE: ', response);
    }

    async storePersistent() {
        this.stateStore.storeClientConfiguration(this.config);
    }

    static async restoreFromPersistent() {
        const store = new StateStore();
        const config = await store.restoreClientConfiguration();
        if (config) {
            Log.debug('Restoring client from storage...');
            return new Client(config);
        } else {
            throw Error(
                'Client.restoreFromPersistent not able to retrieve config from storage.'
            );
        }
    }

    store() {
        global.OIDCClient = this;
    }

    static async restore() {
        if (global.hasOwnProperty('OIDCClient') && global.OIDCClient) {
            return global.OIDCClient;
        } else {
            throw new Error(`Client.restore no client in global namespace.`);
        }
    }

    get tokenKey() {
        const { authority, client_id } = this.config;
        return Global.accessTokenKey(authority, client_id);
    }

    async storeToken(token) {
        if (token) {
            const key = this.tokenKey;
            Log.debug(`Client.storeToken with key ${key}`);
            const storageString = token.toStorageString();
            return this.stateStore.set(key, storageString);
        } else {
            throw new Error(`Client.storeToken no access token given.`);
        }
    }

    async removeToken() {
        const key = this.tokenKey;
        Log.debug(`Client.removeToken with key ${key}`);
        return this.stateStore.remove(key);
    }

    // static way to retrieve the access token for a given configuration
    // just pass a config object
    async getToken() {
        const key = this.tokenKey;
        Log.debug(`Client.getAccessToken with key ${key}`);
        return Token.fromStorageString(this.stateStore.get(key));
    }

    clearStaleState(stateStore) {
        Log.debug('Client.clearStaleState');

        stateStore = stateStore || this.stateStore;

        return State.clearStaleState(stateStore, this.config.staleStateAge);
    }
}
