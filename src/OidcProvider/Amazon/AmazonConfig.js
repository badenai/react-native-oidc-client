import Config from './../Config';

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
        });
    }
}

export default AmazonConfig;
