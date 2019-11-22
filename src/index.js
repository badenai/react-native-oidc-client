// import { AppRegistry } from 'react-native';
// import App from './App';

//AppRegistry.registerComponent('react_native_oidc_client', () => App);

// RedirectComponents
import RedirectComponent from './RedirectComponent';

// Config types
import Config from './Config';
import AmazonConfig from './OidcProvider/Amazon/AmazonConfig';
import FacebookConfig from './OidcProvider/Facebook/FacebookConfig';
import GoogleConfig from './OidcProvider/Google/GoogleConfig';

import Client from './Client';
import JoseUtil from './JoseUtil';
import Token from './Token';

module.exports = {
    // RedirectComponents
    RedirectComponent,
    // Config types
    Config,
    AmazonConfig,
    FacebookConfig,
    GoogleConfig,
    // Business objects
    Client,
    JoseUtil,
    Token,
};
