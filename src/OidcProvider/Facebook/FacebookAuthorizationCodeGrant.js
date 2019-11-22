import Global from './../../Global';
import RedirectNavigator from './../../RedirectNavigator';
import AuthorizeState from './../../AuthorizationState';
import AuthorizationCodeGrant from '../../AuthorizationCodeGrant';

export default class FacebookAuthorizationCodeGrant extends AuthorizationCodeGrant {
    async prepareState(requestParams) {
        this.state = new AuthorizeState({
            nonce: undefined,
            client_id: requestParams.client_id,
            authority: this.config.authority,
            authorization_flow: Global.AUTHORIZATION_FLOWS.AUTHORIZATION_CODE,
        });
        requestParams.state = this.state.id;
        return requestParams;
    }

    async request() {
        try {
            await this.config.stateStore.set(
                `${this.state.id}#_=_`,
                this.state.toStorageString()
            );
            return RedirectNavigator.navigate(this.url);
        } catch (err) {
            throw Error(`Navigating to ${this.url} failed.`);
        }
    }
}
