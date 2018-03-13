import Log from './Log';
import UrlUtility from './UrlUtility';

export default class EndSessionRequest {
    constructor(config) {
        Log.debug('create EndSessionRequest');

        this.config = config;
    }

    async prepare(id_token) {
        if (!id_token) {
            Log.error('No id_token passed to EndSessionRequest');
            throw new Error('id_token');
        }

        this.url = await this.config.metadataService.getEndSessionEndpoint();

        if (!this.url) {
            Log.error(
                'MetadataService could not obtain an endsession_endpoint.'
            );
            throw new Error('no endsession_endpoint');
        }

        const requestParams = {
            id_token_hint: id_token,
        };

        this.requestBody = UrlUtility.buildRequestForm(requestParams);

        Log.debug(`EndSessionRequest prepare url ${this.requestBody}`);
    }

    async request() {
        return this.config.requestService.formRequest(
            this.url,
            this.requestBody
        );
    }

    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
}
