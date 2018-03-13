import Log from './Log';
import RefreshTokenGrant from './RefreshTokenGrant';

export default class RefreshTokenService {
    constructor(config) {
        this.config = config;
    }

    async refresh(accessToken) {
        const refreshTokenGrant = new RefreshTokenGrant(this.config);
        await refreshTokenGrant.prepare(accessToken.refresh_token);
        const responseJSON = await refreshTokenGrant.request();
        const response = await responseJSON.json();
        return response;
    }

    start() {
        if (!this._callback) {
            this._callback = this._tokenExpiring.bind(this);
            this._userManager.events.addAccessTokenExpiring(this._callback);

            // this will trigger loading of the user so the expiring events can be initialized
            this._userManager
                .getUser()
                .then(user => {
                    // deliberate nop
                })
                .catch(err => {
                    // catch to suppress errors since we're in a ctor
                    Log.error('Error from getUser:', err.message);
                });
        }
    }

    stop() {
        if (this._callback) {
            this._userManager.events.removeAccessTokenExpiring(this._callback);
            delete this._callback;
        }
    }

    _tokenExpiring() {
        Log.debug('RefreshTokenService automatically renewing access token');

        this._userManager.signinSilent().then(
            user => {
                Log.debug('Silent token renewal successful');
            },
            err => {
                Log.error('Error from signinSilent:', err.message);
                this._userManager.events._raiseSilentRenewError(err);
            }
        );
    }
}
