/* My own implementation of fetch() */
// references: https://gomakethings.com/promise-based-xhr/

export const myFetch = function (url, options = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(options.method || 'GET', url);

        if (options.headers) {
            Object.keys(options.headers).forEach(k => {
                xhr.setRequestHeader(k, options.headers[k]);
            });
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                    json: () => Promise.resolve(JSON.parse(this.response)),
                    text: () => Promise.resolve(this.response),
                });
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };

        xhr.send(options.body);
    });
};
