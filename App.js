/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AsyncStorage,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Linking,
} from 'react-native';

import Global from './src/Global';
import Client from './src/Client';
import Config from './src/Config';
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
        Global.localStorage = AsyncStorage;
        // const auth_endpoint ='http://vm-plm-elite.contact.de:80/oidc/authorization';

        // const config = {
        //     response_type: 'code',
        //     scope: 'openid profile offline_access',
        //     client_id: 'd8ictrp81Ewv',
        //     client_secret:
        //         '612d658e6b93ab3729edf4304deb53d55e4e3979f59f126a881bd701',
        //     redirect_uri: 'https://com.reactnativeoidcclient',
        //     acr_values: 'http://oidc.contact.de',
        //     acr: 'default',
        //     prompt: 'consent login',
        //     authority: 'http://vm-plm-elite.contact.de:80/oidc',
        //     loadUserInfo: false,
        // };
        const config = {
            response_type: 'code',
            scope: 'openid',
            client_id:
                '817116679875-jobppm3n1qvpr7im7fa83c2vn7561d1q.apps.googleusercontent.com',
            redirect_uri:
                'com.googleusercontent.apps.817116679875-jobppm3n1qvpr7im7fa83c2vn7561d1q:/oauth2redirect/google',
            // authorizationEndpoint: auth_endpoint,
            authority: 'https://accounts.google.com',
            // extraQueryParams: {
            //     access_type: 'offline',
            // },
        };
        const client = new Client(config);
        const response = await client.authorize();
        console.log('THIS SHOULD HAPPEN LAST.', response);
        await client.refresh();
        // await client.endSession(response.id_token);
        // console.log('REQUEST', r);
        // const item = await AsyncStorage.getItem('oidc.METADATA');
        // const item2 = await AsyncStorage.getItem('oidc.CONFIG');
        // console.log("METADDATA FROM STORE:", item2);
        // const newClient = await Client.restore();
        // console.log("RESOTRED CLIENT:", newClient)
    };

    render() {
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
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        );
    }
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
