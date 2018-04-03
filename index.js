import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('react_native_oidc_client', () => App);

// RedirectComponents
import RedirectComponent from './src/RedirectComponent';

// Config types
import Config from './src/Config';
import AmazonConfig from './src/OidcProvider/Amazon/AmazonConfig';

import Client from './src/Client';
import JoseUtil from './src/JoseUtil';
import Token from './src/Token';

export {
    // RedirectComponents
    RedirectComponent,
    // Config types
    Config,
    AmazonConfig,
    // Business objects
    Client,
    JoseUtil,
    Token,
};
