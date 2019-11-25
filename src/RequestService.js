import Log from './Log';
import ErrorResponse from './ErrorResponse';

export default class RequestService {
    async formRequest(url, data) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data,
            });
            if (response.error) {
                Log.warn('Response was error', response.error);
                return reject(new ErrorResponse(response));
            }
            return resolve(response);
        });
    }

    fixTrailingCommaInJsonString(input) {
        const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
        return input.replace(regex, '');
    }

    async getJson(url, token) {
        Log.debug('RequestService.getJson', url);

        if (!url) {
            Log.error('No url passed');
            throw new Error('url');
        }
        return new Promise(async (resolve, reject) => {
            try {
                const options = token
                    ? {
                          method: 'GET',
                          headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                          },
                      }
                    : {
                          method: 'GET',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                      };
                const req = await fetch(url, options);
                // clone in case we can not extract valid JSON
                const cloneResponse = req.clone();
                if (req.status === 200) {
                    try {
                        resolve(await req.json());
                    } catch (e) {
                        try {
                            Log.debug(
                                'Error parsing JSON response. Try to convert it.',
                                e.message
                            );
                            const data = await cloneResponse.text();
                            resolve(
                                JSON.parse(
                                    this.fixTrailingCommaInJsonString(data)
                                )
                            );
                        } catch (e) {
                            Log.error('Error parsing JSON response', e.message);
                            reject(e);
                        }
                    }
                } else {
                    reject(Error(req.statusText + ' (' + req.status + ')'));
                }
            } catch (err) {
                Log.error('network error');
                reject(Error('Network Error'));
            }
        });
    }
}
