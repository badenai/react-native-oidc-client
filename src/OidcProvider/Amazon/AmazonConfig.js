import Config from './../../Config';
import AmazonResponseValidator from './AmazonResponseValidator';
import AmazonAuthorizationCodeGrant from './AmazonAuthorizationCodeGrant';

class AmazonConfig extends Config {
    constructor(config) {
        super({
            ...config,
            authority: 'https://api.amazon.com/auth/o2',
            metadata: {
                authorization_endpoint: 'https://www.amazon.com/ap/oa',
                token_endpoint: 'https://api.amazon.com/auth/o2/token',
                userinfo_endpoint: 'https://api.amazon.com/user/profile',
            },
            ResponseValidatorCtor: AmazonResponseValidator,
            AuthorizationGrantCtor: AmazonAuthorizationCodeGrant,
            // not available for amazon
            filterProtocolClaims: false,
        });
    }
}

export default AmazonConfig;
