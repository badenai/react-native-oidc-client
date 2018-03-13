import Log from './Log';
import State from './State';
import random from './random';

export default class AuthorizationState extends State {
    constructor({ nonce, authority, client_id } = {}) {
        super(arguments[0]);

        if (nonce === true) {
            this._nonce = random();
        } else if (nonce) {
            this._nonce = nonce;
        }

        this._authority = authority;
        this._client_id = client_id;
    }

    get nonce() {
        return this._nonce;
    }
    get authority() {
        return this._authority;
    }
    get client_id() {
        return this._client_id;
    }

    toStorageString() {
        Log.debug('AuthorizationState.toStorageString');
        const storageString = JSON.stringify({
            id: this.id,
            authorization_flow: this.authorization_flow,
            created: this.created,
            nonce: this.nonce,
            authority: this.authority,
            client_id: this.client_id,
        });
        Log.debug(`AuthorizationState.toStorageString: ${storageString}`);
        return storageString;
    }

    static fromStorageString(storageString) {
        Log.debug('AuthorizationState.fromStorageString');
        if (storageString) {
            var data = JSON.parse(storageString);
            return new AuthorizationState(data);
        } else {
            throw new Error(
                `AuthorizationState.fromStorageString storageString is undefined.`
            );
        }
    }
}
