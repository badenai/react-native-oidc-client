import { Linking } from 'react-native';
import Log from './Log';

export default class RedirectNavigator {
    static async navigate(url) {
        Log.debug('RedirectNavigator.navigate');

        if (!url) {
            Log.error('No url provided');
            return Promise.reject(new Error('No url provided'));
        }
        return Linking.openURL(url);
    }
}
