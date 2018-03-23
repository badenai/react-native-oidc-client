import React, { Component } from 'react';
import Log from './Log';
import { Linking } from 'react-native';

import Client from './Client';

class RedirectComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Linking.getInitialURL()
            .then(ev => {
                if (ev) {
                    this._handleOpenURL(ev);
                }
            })
            .catch(err => {
                console.warn('An error occurred', err);
            });
        Linking.addEventListener('url', this._handleOpenURL);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    _handleOpenURL = async event => {
        const { url } = event;
        const client = await Client.restore();
        if (url.startsWith(client.config.redirect_uri)) {
            Log.debug(`RedirectComponent: handle url ${url}`);
            client.handleRedirect(url);
        } else {
            Log.debug(`RedirectComponent: ignore url ${url}`);
        }
    };

    render = () => null;
}

export default RedirectComponent;
