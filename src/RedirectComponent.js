import React, { Component } from 'react';
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

        client.handleRedirect(url);
    };

    render = () => null;
}

export default RedirectComponent;
