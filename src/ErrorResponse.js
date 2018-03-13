import Log from './Log';

export default class ErrorResponse extends Error {
    constructor({ error, error_description, error_uri, state } = {}) {
        if (!error) {
            Log.error('No error passed to ErrorResponse');
            throw new Error('error');
        }

        super(error_description || error);

        this.name = 'ErrorResponse';

        this.error = error;
        this.error_description = error_description;
        this.error_uri = error_uri;

        this.state = state;
    }
}
