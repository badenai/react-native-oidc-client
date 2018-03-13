import Log from './Log';
import Global from './Global';
import Config from './Config';

export default class StateStore {
    constructor(store = Global.storage) {
        this._store = store;
        this._prefix = Global.storeKeyPrefix;
    }

    set = async (key, value) => {
        key = this._prefix + key;
        Log.debug('StateStore.set', key);

        return await this._store.setItem(key, value);
    };

    get = key => {
        key = this._prefix + key;
        Log.debug('StateStore.get', key);

        let item = this._store.getItem(key);

        return item;
    };

    remove = key => {
        key = this._prefix + key;
        Log.debug('StateStore.remove', key);

        let item = this._store.getItem(key);
        this._store.removeItem(key);

        return item;
    };

    getAllKeys = async () => {
        Log.debug('StateStore.getAllKeys');

        return this._store.getAllKeys();
    };

    storeClientConfiguration = async config => {
        if (config instanceof Config) {
            Log.debug('StateStore store config');
            // store the config
            await this.set(Global.configKey, config.toStorageString());

            // store the metadata
            if (!config.metadata) {
                Log.debug('storeClientConfiguration no metadata to store.');
            }
        } else {
            throw Error(
                'storeClientConfiguration given config is not supported.'
            );
        }
    };

    restoreClientConfiguration = async () => {
        const configJSON = await this.get(Global.configKey);
        if (configJSON) {
            const config = Config.fromStorageString(configJSON);
            return config;
        } else {
            Log.debug(
                'restoreClientConfiguration no config to restore. We can not continue.'
            );
            throw Error(
                'restoreClientConfiguration at least we need a stored config for the Client.'
            );
        }
    };
}
