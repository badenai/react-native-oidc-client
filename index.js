import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('react_native_oidc_client', () => App);

// RedirectComponents
import RedirectComponent from './src/RedirectComponent';

// Config types
import AmazonConfig from './src/OidcProvider/Amazon/AmazonConfig';

import Client from './src/Client';

export {
    // RedirectComponents
    RedirectComponent,
    // Config types
    AmazonConfig,
    // Business objects
    Client,
};
