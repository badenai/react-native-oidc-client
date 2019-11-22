import Config from './../../Config';
import FacebookAuthorizationCodeGrant from './FacebookAuthorizationCodeGrant';

class FacebookConfig extends Config {
    constructor(config) {
        super({
            authority: 'https://www.facebook.com/v5.0/dialog/oauth',
            metadata: {
                authorization_endpoint:
                    'https://www.facebook.com/v5.0/dialog/oauth',
                token_endpoint:
                    'https://graph.facebook.com/v5.0/oauth/access_token',
                userinfo_endpoint: 'https://api.amazon.com/user/profile',
            },
            AuthorizationGrantCtor: FacebookAuthorizationCodeGrant,
            ...config,
        });
    }
}

export default FacebookConfig;
