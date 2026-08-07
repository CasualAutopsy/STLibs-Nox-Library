const { SharedEndpointRequests } = await import('./shared.js');

/**
 * Functions for accessing KoboldCpp's API.
 *
 * Spilt into the following categories:
 * - Unified
 * - OpenAI
 * - SD
 * - Info
 * - Extra
 * - Admin
 */
const KoboAPI = (() => {
    const { endpointGet, endpointPost } = SharedEndpointRequests;

    /**
     * KoboldAI United compatible API core endpoints.
     */
    const Unified = {
        // === GET ENDPOINTS ===

        /**
         * Get the max context length setting value.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboMaxPrompt(host, apikey = null){
            return endpointGet(host, 'api/v1/config/max_context_length', apikey);
        },

        /**
         * Get the default max (or absolute max if set as such) generation length setting value.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboMaxGen(host, apikey = null){
            return endpointGet(host, 'api/v1/config/max_length', apikey);
        },

        /**
         * Returns the matching KoboldAI (United) version of the API that you are currently using
         *
         * This is not the same as the KoboldCpp API version - this is used to feature match against KoboldAI United
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboUnitedVersion(host, apikey = null){
            return endpointGet(host, 'api/v1/info/version', apikey);
        },

        /**
         * Get the current loaded model's display name.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} apikey - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboCurrentModel(host, apikey = null){
            return endpointGet(host, 'api/v1/model', apikey);
        },

        // === POST ENDPOINTS ===

        /**
         * Generates text based on a prompt and generation settings.
         *
         * Unspecified values are set to defaults.
         *
         * @method `POST`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key.
         * @param {String} prompt - The prompt to run an autocompletion on.
         * @param {Object|Null} [samplers = Null] - The sampler settings to use for the generation.
         * @param {String|Null} [genkey = Null] - The ID of the generation to assign to the autocompletion task.
         * @param {Boolean|Null} [quiet = Null] - Whether to suppress logging the generation.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboGeneration(
            host, apikey = null,
            prompt = "", samplers = null,
            genkey = null, quiet = null
        ){
            const payload = {
                "prompt": prompt,
                "genkey": genkey != null ? genkey : "",
                "quiet": quiet != null ? quiet : false
            };

            if (typeof samplers != 'undefined') {
                Object.assign(payload, typeof samplers == "string" ? JSON.parse(samplers) : samplers);
            }



            return endpointPost(host, "api/v1/generate", payload, apikey)
        }
    };

    /**
     * (WIP)OpenAI compatible API endpoints.
     */
    const OpenAI = {
        // === GET ENDPOINTS ===

        // === POST ENDPOINTS ===
    }

    /**
    * Image Generation API endpoints.
    */
    const SD = {
        // === GET ENDPOINTS ===

        /**
         * Get a list of available image generation models.
         *
         * For koboldcpp, only one model will be returned. If no model is loaded, the list is empty.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null)
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboSDModels(host, apikey = null){
            return endpointGet(host,'sdapi/v1/sd-models', apikey);
        },

        /**
         * Get the configuration info for image generation, used to get loaded model name in A1111
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null)
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboSDOptions(host, apikey = null){
            return endpointGet(host, 'sdapi/v1/options', apikey);
        },

        /**
         * Get a list of supported samplers.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboSDSamplers(host, apikey = null){
            return endpointGet(host, 'sdapi/v1/samplers', apikey);
        },
    };

    /**
     * Common identity API endpoints.
     */
    const Info = {
        /**
         * Get the Jinja template stored in the GGUF model, if found.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null)
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboPropsInfo(host, apikey = null){
            return endpointGet(host, 'props', apikey);
        },

        /**
         * Get the common API identity provider.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null)
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboServiceInfo(host, apikey = null){
            return endpointGet(host, '.well-known/serviceinfo', apikey);
        },
    };


    /**
     * Extras API endpoints.
     */
    const Extra = {
        // === GET ENDPOINTS ===

        /**
         * Get the KoboldCpp backend version and active modules.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboVersionInfo(host, apikey = null){
            return endpointGet(host, 'api/extra/version', apikey);
        },

        /**
         * Get recent KoboldCpp performance information.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key. (Default: null)
         *
         * @returns {Promise<Object>}
         */
        async koboPerfInfo(host, apikey = null){
            return endpointGet(host, 'api/extra/perf', apikey);
        },

        // === POST ENDPOINTS ===

        /**
         * Counts the number of tokens in a string, and returns their token IDs
         *
         * @method `POST`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String} prompt - Prompt to tokenize.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboTokenize(host, prompt, apikey = null){
            return endpointPost(host, 'api/extra/tokenize', {"prompt": prompt}, apikey);
        },

        /**
         * Converts an array of token IDs into a string.
         *
         * @method `POST`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {Array<number>|String} ids - IDs to convert.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboDetokenize(host, ids, apikey = null){
            return endpointPost(host, 'api/extra/detokenize', {"ids": typeof ids == "string" ? JSON.parse(ids) : ids}, apikey);
        },

        /**
         * Creates a single or multiple embedding vectors representing the input text.
         *
         * @method `POST`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String} docs - String or array of strings to encode.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboEmbedding(host, docs, apikey = null, truncate = true){
            let /** @type {Array<string>} */ docs_list = [];
            try {
                docs_list = JSON.parse(docs);

                if (!docs_list.every(item => typeof item === 'string')) {
                    throw new TypeError('Error: Input must be a string or a list of strings');
                }
            } catch {
                if (typeof docs !== 'string') {
                    throw new TypeError('Error: Input must be a string or a list of strings');
                }
            }

            return endpointPost(
                host,
                'api/extra/embeddings',
                {
                    "model":"kcpp",
                    "input": docs_list.length > 0 ? docs_list : docs,
                    "truncate": truncate
                },
                apikey
            );
        },

        /**
         * Converts a provided JSON schema into GBNF grammar.
         *
         * @method `POST`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {Object|String} schema - The provided JSON schema.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboJSONtoGrammar(host, schema, apikey = null){
            return endpointPost(host, 'api/extra/json_to_grammar', {"schema": typeof schema === 'string' ? JSON.parse(schema) : schema}, apikey);
        },
    };

    /**
     * Admin API endpoints.
     */
    const Admin = {
        /**
         * Get a list of available .kcpps files that can be loaded.
         *
         * @method `GET`
         *
         * @param {String} host - KoboldCpp hosted base URL.
         * @param {String|Null} [apikey = Null] - API authorization key.
         *
         * @returns {Promise<Object>} The response from the endpoint.
         */
        async koboListOptions(host, apikey= null){
            return endpointGet(host, 'api/admin/list_options', apikey);
        },
    };

    return {
        Unified,
        OpenAI,
        SD,
        Info,
        Extra,
        Admin,
    };
})();


export default KoboAPI;
export {  };
