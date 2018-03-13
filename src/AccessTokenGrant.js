import Log from './Log';
import AuthorizationGrant from './AuthorizationGrant';
import UrlUtility from './UrlUtility';
import ErrorResponse from './ErrorResponse';

export default class AccessTokenGrant extends AuthorizationGrant {
    constructor(config) {
        super(config);
        Log.debug('create AccessTokenGrant');
    }

    async prepare(code) {
        this.url = await this.config.metadataService.getTokenEndpoint();
        const requestParams = this.cleanRequest({
            grant_type: 'authorization_code',
            code: code,
            client_secret: this.config._client_secret,
            redirect_uri: this.config._redirect_uri,
            client_id: this.config._client_id,
        });

        if (!requestParams.code) {
            Log.error('No code passed to AuthorizationCodeGrant');
            throw new Error('code');
        }

        this.requestBody = UrlUtility.buildRequestForm(requestParams);
    }

    async request() {
        return this.config.requestService.formRequest(
            this.url,
            this.requestBody
        );
    }
}
