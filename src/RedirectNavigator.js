import { Linking, Platform } from 'react-native';

import Log from './Log';
import Global from './Global';

let InAppBrowser;
try {
    InAppBrowser = require('react-native-inappbrowser-reborn').default;
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
    }
    InAppBrowser = undefined;
}

export default class RedirectNavigator {
    // must be set from config
    static browser_type = '';

    static async navigate(url, redirectUri) {
        Log.debug('RedirectNavigator.navigate');

        if (!url) {
            Log.error('No url provided');
            return Promise.reject(new Error('No url provided'));
        }
        try {
            if (
                this.browser_type == Global.BROWSER_TYPES.INAPPBROWSER &&
                (await InAppBrowser.isAvailable())
            ) {
                const responsePromise = InAppBrowser.openAuth(
                    url,
                    redirectUri,
                    {
                        // iOS Properties
                        ephemeralWebSession: true,
                        // Android Properties
                        showTitle: false,
                        enableUrlBarHiding: true,
                        enableDefaultShare: false,
                    }
                );
                if (Platform.OS === 'ios') {
                    const response = await responsePromise;
                    if (response.type === 'success' && response.url) {
                        Linking.openURL(response.url);
                    }
                }
                return responsePromise;
            } else if (
                this.browser_type == Global.BROWSER_TYPES.SYSTEMBROWSER
            ) {
                return Linking.openURL(url);
            } else {
                throw new Error(
                    `browser_type '${this.browser_type}' not recognized!`
                );
            }
        } catch (error) {
            Log.error(error.message);
            return Promise.reject(error);
        }
    }
}
