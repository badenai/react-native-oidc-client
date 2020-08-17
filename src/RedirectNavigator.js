import { Linking } from 'react-native';

import Log from './Log';

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

    static async navigate(url) {
        Log.debug('RedirectNavigator.navigate');

        if (!url) {
            Log.error('No url provided');
            return Promise.reject(new Error('No url provided'));
        }

        try {
            if (
                this.browser_type == 'inapp' &&
                (await InAppBrowser.isAvailable())
            ) {
                return InAppBrowser.openAuth(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'partialCurl',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    enableUrlBarHiding: true,
                    forceCloseOnRedirection: false,
                    // Animation
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right',
                    },
                });
            } else if (this.browser_type == 'default') {
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
