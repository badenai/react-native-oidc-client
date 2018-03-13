import Log from './Log';
import AuthorizationGrant from './AuthorizationGrant';
import UrlUtility from './UrlUtility';

export default class RefreshTokenGrant extends AuthorizationGrant {
    constructor(config) {
        super(config);
        Log.debug('create RefreshTokenGrant');
    }

    async prepare(refresh_token) {
        this.url = await this.config.metadataService.getTokenEndpoint();
        const requestParams = this.cleanRequest({
            grant_type: 'refresh_token',
            client_id: this.config.client_id,
            client_secret: this.config.client_secret,
            refresh_token: refresh_token,
            scope: this.config.scope,
        });

        if (!requestParams.refresh_token) {
            Log.error('No refresh_token passed to RefreshTokenGrant');
            throw new Error('refresh_token');
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
