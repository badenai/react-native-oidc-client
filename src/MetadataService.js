import Log from './Log';
import RequestService from './RequestService';

const OidcMetadataUrlPath = '.well-known/openid-configuration';

export default class MetadataService {
    constructor(config, RequestServiceCtor = RequestService) {
        if (!config) {
            Log.error('No config passed to MetadataService');
            throw new Error('config');
        }

        this._config = config;
        this._requestService = new RequestServiceCtor();
    }

    get metadataUrl() {
        if (!this._metadataUrl) {
            if (this._config.metadataUrl) {
                this._metadataUrl = this._config.metadataUrl;
            } else {
                this._metadataUrl = this._config.authority;

                if (
                    this._metadataUrl &&
                    this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0
                ) {
                    if (
                        this._metadataUrl[this._metadataUrl.length - 1] !== '/'
                    ) {
                        this._metadataUrl += '/';
                    }
                    this._metadataUrl += OidcMetadataUrlPath;
                }
            }
        }

        return this._metadataUrl;
    }

    getMetadata() {
        Log.debug('MetadataService.getMetadata');

        if (this._config.metadata) {
            Log.debug('Returning metadata from config');
            return Promise.resolve(this._config.metadata);
        }

        if (!this.metadataUrl) {
            Log.error('No authority or metadataUrl configured on config');
            return Promise.reject(
                new Error('No authority or metadataUrl configured on config')
            );
        }

        Log.debug('getting metadata from', this.metadataUrl);

        return this._requestService.getJson(this.metadataUrl).then(metadata => {
            Log.debug('json received');
            this._config.metadata = metadata;
            return metadata;
        });
    }

    getIssuer() {
        Log.debug('MetadataService.getIssuer');
        return this._getMetadataProperty('issuer');
    }

    getAuthorizationEndpoint() {
        Log.debug('MetadataService.getAuthorizationEndpoint');
        return this._getMetadataProperty('authorization_endpoint');
    }

    getUserInfoEndpoint() {
        Log.debug('MetadataService.getUserInfoEndpoint');
        return this._getMetadataProperty('userinfo_endpoint');
    }

    getTokenEndpoint() {
        Log.debug('MetadataService.getTokenEndpoint');
        return this._getMetadataProperty('token_endpoint', true);
    }

    getCheckSessionIframe() {
        Log.debug('MetadataService.getCheckSessionIframe');
        return this._getMetadataProperty('check_session_iframe', true);
    }

    getEndSessionEndpoint() {
        Log.debug('MetadataService.getEndSessionEndpoint');
        return this._getMetadataProperty('end_session_endpoint', true);
    }

    getRevocationEndpoint() {
        Log.debug('MetadataService.getRevocationEndpoint');
        return this._getMetadataProperty('revocation_endpoint', true);
    }

    _getMetadataProperty(name, optional = false) {
        Log.debug('MetadataService._getMetadataProperty', name);

        return this.getMetadata().then(metadata => {
            Log.debug('metadata recieved');

            if (metadata[name] === undefined) {
                if (optional === true) {
                    Log.warn(
                        'Metadata does not contain optional property ' + name
                    );
                    return undefined;
                } else {
                    Log.error('Metadata does not contain property ' + name);
                    throw new Error(
                        'Metadata does not contain property ' + name
                    );
                }
            }

            return metadata[name];
        });
    }

    getSigningKeys() {
        Log.debug('MetadataService.getSigningKeys');

        if (this._config.signingKeys) {
            Log.debug('Returning signingKeys from config');
            return Promise.resolve(this._config.signingKeys);
        }

        return this._getMetadataProperty('jwks_uri').then(jwks_uri => {
            Log.debug('jwks_uri received', jwks_uri);

            return this._requestService.getJson(jwks_uri).then(keySet => {
                Log.debug('key set received', keySet);

                if (!keySet.keys) {
                    Log.error('Missing keys on keyset');
                    throw new Error('Missing keys on keyset');
                }

                this._config.signingKeys = keySet.keys;
                return this._config.signingKeys;
            });
        });
    }
}
