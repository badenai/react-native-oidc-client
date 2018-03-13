import Log from './Log';
import PopupWindow from './PopupWindow';

export default class PopupNavigator {
    prepare(params) {
        let popup = new PopupWindow(params);
        return Promise.resolve(popup);
    }

    callback(url, keepOpen, delimiter) {
        Log.debug('PopupNavigator.callback');

        try {
            PopupWindow.notifyOpener(url, keepOpen, delimiter);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
