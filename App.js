/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    AsyncStorage,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Linking,
} from "react-native";
import { jws, crypto, KEYUTIL as KeyUtil } from "jsrsasign";
import Global from "./src/Global";
import Client from "./src/Client";
import Config from "./src/Config";
import RedirectComponent from "./src/RedirectComponent";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android:
        "Double tap R on your keyboard to reload,\n" +
        "Shake or press menu button for dev menu",
});

type Props = {};
export default class App extends Component<Props> {
    doIt = async () => {
        Global.localStorage = AsyncStorage;
        // const auth_endpoint ="http://vm-plm-elite.contact.de:80/oidc/authorization";

        const config = {
            response_type: "id_token token",
            scope: "openid profile offline_access",
            client_id: "XsTG8yZCxZLT",
            client_secret:
                "1a7fcf2d0de3ee6a10bac0bdad3a85b7810184a4fbf52daed89da3e4",
            redirect_uri: "https://com.reactnativeoidcclient",
            acr_values: "http://oidc.contact.de",
            acr: "default",
            prompt: "consent login",
            authority: "http://con-023.contact.de:80/oidc",
            loadUserInfo: false,
        };

        const client = new Client(config);
        const response = await client.authorize();
        console.log("THIS SHOULD HAPPEN LAST.", response);
        // await client.refresh();
        // await client.endSession(response.id_token);
        // console.log("REQUEST", r);
        // const item = await AsyncStorage.getItem("oidc.METADATA");
        // const item2 = await AsyncStorage.getItem("oidc.CONFIG");
        // console.log("METADDATA FROM STORE:", item2);
        // const newClient = await Client.restore();
        // console.log("RESOTRED CLIENT:", newClient)
        // this.jsSign();
    };

    jsSign() {
        // const rsa =
            // "{"use": "sig","n": "iGPu9ntDxPZUjh_ZxPSBwUOeGMPocyzrEAHcaaSNJWChlXctiFp6veOkl1yi59FF7R90GWe5YLmGE9UOOMhvk8Tw7zH5yqwQpUNb-9EvRVQ4kzE5DDqxTXBdudMnU3V2GnxOTAaF2xOABBMkVbcEWuI6UfA005GhyGoSUTUQqEl_i8fbfZJ7eiYV7qbW2500Db6TSwI1p6nbtcA5V0iMgoRVUUNbi6oEH1oF1L3DAr-QqcKe-SSwl_VmWFQI1uB_mCJL42q6N-tAw15JAV--Nk_zfpNBEHjNBNQzyjL2Ls5pk7D8PG7ahsjKIlTssvE-am9jBowpNDeMy2KXoTYyyQ","e": "AQAB","kty": "RSA","kid": "op1"}";
            // "{"use": "enc", "crv": "P-256", "kty": "EC", "y": "5CBT5b5YxXMPFACasMG9WYnp3DOP2Sgvml1PDtaMVrc", "x": "ZWNRDU4vz-wh4c4KMsJLQlSfdryX8t_WSs2toR0YkQ8", "kid": "op3"}"
            // "{"use": "enc", "n": "iGPu9ntDxPZUjh_ZxPSBwUOeGMPocyzrEAHcaaSNJWChlXctiFp6veOkl1yi59FF7R90GWe5YLmGE9UOOMhvk8Tw7zH5yqwQpUNb-9EvRVQ4kzE5DDqxTXBdudMnU3V2GnxOTAaF2xOABBMkVbcEWuI6UfA005GhyGoSUTUQqEl_i8fbfZJ7eiYV7qbW2500Db6TSwI1p6nbtcA5V0iMgoRVUUNbi6oEH1oF1L3DAr-QqcKe-SSwl_VmWFQI1uB_mCJL42q6N-tAw15JAV--Nk_zfpNBEHjNBNQzyjL2Ls5pk7D8PG7ahsjKIlTssvE-am9jBowpNDeMy2KXoTYyyQ", "e": "AQAB", "kty": "RSA", "kid": "op0"}";
        // const key = KeyUtil.getKey(rsa);
        // console.log("KEY: ", key);
        const header = {"alg":"HS256"};
        const payload =
            {"iss": "http://vm-plm-elite.contact.de:80/oidc", "sub": "9a33165346bba7ec5b3e6cca05b737df372e213c5d9fb53a7878162a59eb6960", "aud": "d8ictrp81Ewv", "nbf": 1521012749, "exp": 1521022749};
        // var prvKey = KeyUtil.getKey("sRSAPRV_PKCS8PEM", "password");
        let sJWS = jws.JWS.sign(null, JSON.stringify(header), JSON.stringify(payload), { utf8: "pass" });
        // const sJWS = new crypto.Signature(header);
        console.log("JWT", sJWS);
    }

    render() {
        return (
            <View style={styles.container}>
                <RedirectComponent />
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Button
                    title={"doIt"}
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});
