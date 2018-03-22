import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('react_native_oidc_client', () => App);

// Config types
import AmazonConfig from './src/OidcProvider/Amazon/AmazonConfig';

import Client from './src/Client';

export default {
    // Config types
    AmazonConfig,
    // Business objects
    Client,
};
