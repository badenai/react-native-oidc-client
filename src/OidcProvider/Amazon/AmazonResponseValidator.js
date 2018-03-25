import Log from './../../Log';
import ResponseValidator from '../../ResponseValidator';

class AmazonResponseValidator extends ResponseValidator {
    async _processClaims(response) {
        Log.debug('AmazonResponseValidator._processClaims');

        if (this._config.loadUserInfo && response.access_token) {
            Log.debug('loading user info');

            const claims = await this._userInfoService.getClaims(
                response.access_token
            );
            Log.debug('user info claims received from user info endpoint');

            if (!claims.user_id) {
                Log.error('no user_id in userInfo response');
                return Promise.reject(
                    new Error('no user_id in userInfo response')
                );
            }

            response.profile = this._mergeClaims(response.profile, claims);
            Log.debug(
                'user info claims received, updated profile:',
                response.profile
            );

            return response;
        } else {
            Log.debug('not loading user info for amazon');
        }

        return Promise.resolve(response);
    }
}

export default AmazonResponseValidator;
