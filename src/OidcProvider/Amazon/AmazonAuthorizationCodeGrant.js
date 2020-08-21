import { AUTHORIZATION_FLOWS } from './../../Constants';
import AuthorizeState from './../../AuthorizationState';
import AuthorizationCodeGrant from '../../AuthorizationCodeGrant';

export default class AmazonAuthorizationCodeGrant extends AuthorizationCodeGrant {
    async prepareState(requestParams) {
        this.state = new AuthorizeState({
            nonce: undefined,
            client_id: requestParams.client_id,
            authority: this.config.authority,
            authorization_flow: AUTHORIZATION_FLOWS.AUTHORIZATION_CODE,
        });
        requestParams.state = this.state.id;
        return requestParams;
    }
}
