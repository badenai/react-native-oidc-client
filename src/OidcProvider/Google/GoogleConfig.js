import Config from './../../Config';

class GoogleConfig extends Config {
    constructor(config) {
        super({
            authority: 'https://accounts.google.com',
            ...config,
        });
    }
}

export default GoogleConfig;
