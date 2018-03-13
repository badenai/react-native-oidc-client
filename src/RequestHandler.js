import Log from './Log';
import UrlUtility from './UrlUtility';
import AuthorizeState from './AuthorizationState';

export const AUTHORIZATION_FLOWS = {
    AUTHORIZATION_CODE: 'AUTHORIZATION_CODE',
    IMPLICIT: 'IMPLICIT',
    CLIENT_CREDENTIAL: 'CLIENT_CREDENTIAL',
};

export default class RequestHandler {
    constructor({ response_type, grant_type }) {
        Log.debug('create RequestHandler');

        if (!response_type && !grant_type) {
            Log.error('RequestHandler No valid OIDC Authentication flow.');
            throw new Error(
                'RequestHandler No valid OIDC Authentication flow.'
            );
        }

        this.response_type = response_type;
        this.grant_type = grant_type;
    }

    static identifyAuthenticationRequest = ({ response_type, grant_type }) => {
        Log.debug('RequestHandler identifyAuthenticationRequest');
        if (!response_type && !grant_type) {
            Log.error('RequestHandler No valid OIDC Authentication flow.');
            throw new Error(
                'RequestHandler No valid OIDC Authentication flow.'
            );
        }

        // https://tools.ietf.org/html/rfc6749
        if (response_type) {
            if (response_type === 'code') {
                return AUTHORIZATION_FLOWS.AUTHORIZATION_CODE;
            }
            if (response_type === 'token') {
                return AUTHORIZATION_FLOWS.IMPLICIT;
            }

            if (grant_type) {
                throw Error(
                    `RequestHandler Can not identify Authentication flow you specifier 
                    both response_type (${response_type}) and grant_type (${grant_type}).`
                );
            }
        }
        if (grant_type) {
            if (grant_type === 'password') {
                throw Error(`RequestHandler Identified Resource Owner Password Credentials Grant. 
                Currently it is not supported.`);
            }
            if (grant_type === 'client_credentials') {
                throw Error(`RequestHandler Identified Client Credentials Grant. 
                Currently it is not supported.`);
            }
            if (grant_type.startsWith('urn')) {
                throw Error(`RequestHandler Identified some kind of extension grant. 
                Currently it is not supported.`);
            }
        }
        throw Error(`RequestHandler can not idenity your request`);
    };
}
