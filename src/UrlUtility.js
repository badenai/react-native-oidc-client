import Log from './Log';
export default class UrlUtility {
    static addQueryParam(url, name, value) {
        if (url.indexOf('?') < 0) {
            url += '?';
        }

        if (url[url.length - 1] !== '?') {
            url += '&';
        }

        url += encodeURIComponent(name);
        url += '=';
        url += encodeURIComponent(value);

        return url;
    }

    static parseUrlFragment(value, delimiter = '#') {
        Log.debug('UrlUtility.parseUrlFragment');

        var idx = value.lastIndexOf(delimiter);
        if (idx >= 0) {
            value = value.substr(idx + 1);
        }

        var params = {},
            regex = /([^&=]+)=([^&]*)/g,
            m;

        var counter = 0;
        while ((m = regex.exec(value))) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            if (counter++ > 50) {
                Log.error(
                    'response exceeded expected number of parameters',
                    value
                );
                return {
                    error: 'Response exceeded expected number of parameters',
                };
            }
        }

        for (var prop in params) {
            return params;
        }

        return {};
    }

    static buildRequestForm(request) {
        return Object.keys(request)
            .map(key => {
                return (
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(request[key])
                );
            })
            .join('&');
    }

    static buildRequestUrl(url, request) {
        if (!url) {
            Log.error('No url passed to AuthorizationGrant');
            throw new Error('no url');
        }
        Object.getOwnPropertyNames(request).forEach(param => {
            url = UrlUtility.addQueryParam(url, param, request[param]);
        });
        return url;
    }
}
