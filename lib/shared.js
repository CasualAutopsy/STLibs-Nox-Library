/**
 * Sharable endpoint request functions that can be reused as helper functions.
 * @method `endpointGet` - Send a GET request to an endpoint.
 * @method `endpointPost` - Send a POST request to an endpoint.
 */
const SharedEndpointRequests = (() => {
    return {
        /**
         * Send a GET request to an endpoint
         *
         * @param {String} host - The base URL of the endpoint.
         * @param {String} endpoint - The endpoint path.
         * @param {String|Null} [apikey = Null] - The API key to use.
         * @returns {Promise<*>} The response from the endpoint.
         */
        async endpointGet(host, endpoint, apikey = null){
            try {
                return (await fetch(`${host}/${endpoint}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${apikey != null ? apikey : "None"}`,
                        "accept": "application/json"
                    }
                })).json();
            } catch (e) {
                console.error(`[endpoint: ${endpoint}]KoboAPI: `,e);
            }
        },

        /**
         * Send a POST request to an endpoint
         *
         * @param {String} host - The base URL of the endpoint.
         * @param {String} endpoint - The endpoint path.
         * @param {Object} payload - The payload to send.
         * @param {String|Null} [apikey = Null] - The API key to use.
         * @returns {Promise<*>} The response from the endpoint.
         */
        async endpointPost(host, endpoint, payload, apikey = null){
            try {
                return (await fetch(`${host}/${endpoint}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apikey !== null ? apikey : "None"}`,
                        "accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })).json();
            } catch (e) {
                console.error(`[endpoint: ${endpoint}]KoboAPI: `,e);
            }
        },
    };
})();

export { SharedEndpointRequests };
