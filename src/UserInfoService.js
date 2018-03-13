import RequestService from './RequestService';
import MetadataService from './MetadataService';
import Log from './Log';

export default class UserInfoService {
    constructor(
        config,
        RequestServiceCtor = RequestService,
        MetadataServiceCtor = MetadataService
    ) {
        if (!config) {
            Log.error('No config passed to UserInfoService');
            throw new Error('config');
        }

        this._config = config;
        this._requestService = new RequestServiceCtor();
        this._metadataService = new MetadataServiceCtor(this._config);
    }

    getClaims(token) {
        Log.debug('UserInfoService.getClaims');

        if (!token) {
            Log.error('No token passed');
            return Promise.reject(new Error('A token is required'));
        }

        return this._metadataService.getUserInfoEndpoint().then(url => {
            Log.debug('received userinfo url', url);

            return this._requestService.getJson(url, token).then(claims => {
                Log.debug('claims received', claims);
                return claims;
            });
        });
    }
}
