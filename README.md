# react-native-oidc-client

This is a pure javascript implementation of an [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html)
client for react-native. It does not rely on any native components for android or ios. The Browser is used as a 
confidential client to authenticate with your OpenID Provider.

The implementation follows the specifications described in [OAuth 2.0](https://tools.ietf.org/html/rfc6749) and 
[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html).

### Usage:
####Prepare your config:
```js
const config = {
        response_type: 'code',
        scope: 'openid profile offline_access',
        client_id: 'xxxxxxxxxxxxxx',
        client_secret:
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        redirect_uri: 'https://com.example',
        acr_values: 'http://oidc.contact.de',
        acr: 'default',
        prompt: 'consent login',
        authority: 'https://youroidcprovider',
    };
```

####Create the client and call authorize:
```js
const client = new Client(config);
const tokenResponse = await client.authorize();
```

You will get a access token response as a result of authorize().
The token response will be stored in the AsyncStorage of react-native by default.
You can also get the access token by calling the getToken() Method of your OIDC Client.

```js
const accessToken = await client.getToken();
```

####Mount the RedirectComponent in your app tree:
```js
<App>
    <SomeComponents>...</SomeComponents>
    <RedirectComponent />
</App>
```
The ``<RedirectComponent />`` has to be mounted somewhere in your app tree to handle the redirect from your
system browser.

####Setup redirect url:
#####Android: 

Add to you main ``<Activity>`` in your ``AndroidManifest.xml`` an ``<intent-filter>``
```
<intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="https" android:host="com.example"/>
</intent-filter>
```

#####IOS:
Coming soon.

