/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import Client from './src/Client';
import RedirectComponent from './src/RedirectComponent';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    doIt = async () => {
        const config = {
            response_type: 'code',
            scope: 'openid profile offline_access',
            client_id: 'xxxxxxxxxxxxxx',
            client_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            redirect_uri: 'https://com.example',
            acr_values: 'http://oidc.contact.de',
            acr: 'default',
            prompt: 'consent login',
            authority: 'https://youroidcprovider',
        };
        const client = new Client(config);
        const tokenResponse = await client.authorize();
        console.log('TOKEN', tokenResponse);
    };

    register = async () => {
        const clientCredentials = await Client.register(
            'https://con-023.contact.de/oidc',
            {
                redirect_uris: ['https://com.example'],
                application_type: 'web',
                token_endpoint_auth_method: 'client_secret_post',
            }
        );
        console.log('Client config', clientCredentials);

        const config = {
            response_type: 'code',
            scope: 'openid profile offline_access',
            redirect_uri: 'https://com.example',
            acr_values: 'http://oidc.contact.de',
            acr: 'default',
            prompt: 'consent login',
            authority: 'https://con-023.contact.de/oidc',
        };

        const client = new Client({ ...config, ...clientCredentials });
        const tokenResponse = await client.authorize();
        console.log('TOKEN', tokenResponse);
    };

    render = () => {
        return (
            <View style={styles.container}>
                <RedirectComponent />
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Button
                    title={'doIt'}
                    onPress={() => {
                        this.doIt();
                    }}
                />
                <Button
                    title={'register'}
                    onPress={() => {
                        this.register();
                    }}
                />
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
