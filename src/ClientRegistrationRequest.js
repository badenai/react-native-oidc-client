import Log from './Log';
import Global from './Global';
import UrlUtility from './UrlUtility';
import MetadataService from './MetadataService';

export default class ClientRegistrationRequest {
    constructor(authority_url, options) {
        this.authority_url = authority_url;
        this.options = options;
        Log.debug('create ClientRegistrationRequest');
    }

    async prepare() {
        if (!this.authority_url)
            throw new Error('ClientRegistrationRequest no authority url');

        if (!this.options)
            throw new Error('ClientRegistrationRequest no options set');

        const metadataService = new MetadataService({
            authority: this.authority_url,
        });
        Log.debug('Client registration getting metadata');
        try {
            this.registrationEndpoint = await metadataService.getRegistrationEndpoint();
        } catch (error) {
            Log.info(
                `Client registration can not obtain registration endpoint`
            );
            throw new Error(error);
        }

        Log.debug(`Client registration endpoint ${this.registrationEndpoint}`);
        if (!this.registrationEndpoint || this.registrationEndpoint === '')
            throw new Error(
                'ClientRegistrationRequest failing to set registration endpoint'
            );
        if (!this.options.redirect_uris)
            throw new Error(
                'ClientRegistrationRequest no options set for redirect_uris. There has to be at least one redirect uri'
            );
    }

    async request() {
        try {
            const registrationInfo = await fetch(this.registrationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(this.options),
            });
            this.registrationInfo = await registrationInfo.json();
            return this.registrationInfo;
        } catch (err) {
            Log.info(
                `ClientRegistrationRequest failed. Endpoint ${this.registrationEndpoint}`,
                err
            );
            throw Error(err);
        }
    }

    getClientCredentials() {
        if (!this.registrationInfo)
            throw new Error(
                'getAuthConfig: no registrationInfo. Make a request first'
            );
        const { client_id, client_secret } = this.registrationInfo;
        if (!client_id || !client_secret)
            throw new Error('getAuthConfig: Invalid client credentials');

        return {
            client_id,
            client_secret,
        };
    }

    get authority_url() {
        return this._authority_url;
    }
    set authority_url(value) {
        this._authority_url = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }
    get registrationInfo() {
        return this._registrationInfo;
    }
    set registrationInfo(value) {
        this._registrationInfo = value;
    }
    get registrationEndpoint() {
        return this._registrationEndpoint;
    }
    set registrationEndpoint(value) {
        this._registrationEndpoint = value;
    }
}
