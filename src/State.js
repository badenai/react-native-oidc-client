// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Log from './Log';
import random from './random';

export default class State {
    constructor({ id, created, authorization_flow } = {}) {
        this._id = id || random();

        if (typeof created === 'number' && created > 0) {
            this._created = created;
        } else {
            this._created = parseInt(Date.now() / 1000);
        }
        this._authorization_flow = authorization_flow;
    }

    get id() {
        return this._id;
    }
    get created() {
        return this._created;
    }

    get authorization_flow() {
        return this._authorization_flow;
    }

    toStorageString() {
        Log.debug('State.toStorageString');
        return this.authorization_flow
            ? JSON.stringify({
                  id: this.id,
                  created: this.created,
                  authorization_flow: this.authorization_flow,
              })
            : JSON.stringify({
                  id: this.id,
                  created: this.created,
              });
    }

    static fromStorageString(storageString) {
        Log.debug('State.fromStorageString');
        return new State(JSON.parse(storageString));
    }

    static clearStaleState(storage, age) {
        Log.debug('State.clearStaleState');

        var cutoff = Date.now() / 1000 - age;

        return storage.getAllKeys().then(keys => {
            Log.debug('got keys', keys);

            var promises = [];
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                var p = storage.get(key).then(item => {
                    let remove = false;

                    if (item) {
                        try {
                            var state = State.fromStorageString(item);

                            Log.debug(
                                'got item from key: ',
                                key,
                                state.created
                            );

                            if (state.created <= cutoff) {
                                remove = true;
                            }
                        } catch (e) {
                            Log.error(
                                'Error parsing state for key',
                                key,
                                e.message
                            );
                            remove = true;
                        }
                    } else {
                        Log.debug('no item in storage for key: ', key);
                        remove = true;
                    }

                    if (remove) {
                        Log.debug('removed item for key: ', key);
                        return storage.remove(key);
                    }
                });

                promises.push(p);
            }

            Log.debug('waiting on promise count:', promises.length);
            return Promise.all(promises);
        });
    }
}
