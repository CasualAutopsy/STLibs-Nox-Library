const YAML = SillyTavern.libs.yaml;

/**
 * @typedef {import('/scripts/slash-commands/SlashCommand.js').NamedArguments} NamedArguments
 * @typedef {import('/scripts/slash-commands/SlashCommand.js').UnnamedArguments} UnnamedArguments
 */

/**
 * Sharable value coercion functions that can be reused as helper functions.
 */
const SharedValueCoercion = (() => {
    return {
        /**
         * Coerce any SillyTavern string value into a bool datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Boolean} - The coerced value.
         */
        boolCoercion(val) {
            return !['false', '0', 'off', ''].includes(val?.trim()?.toLowerCase());
        },

        /**
         * Parse boolean type SillyTavern strings into a strict bool datatype.
         *
         * @param {String} valRaw - The string to perform coercion on.
         * @returns {Boolean} - The coerced value.
         */
        boolParse(valRaw) {
            const val = valRaw?.trim()?.toLowerCase();

            if (['false', 'off'].includes(val) === true) {
                return false;
            } else if (['true', 'on'].includes(val) === true) {
                return true;
            } else {
                throw new TypeError('[Nox-Lib] Invalid boolean: ' + val);
            }
        },

        /**
         * Parse floatpoint type SillyTavern strings into a number datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Number} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted as a proper floatpoint.
         */
        floatParse(val) {
            if (val.match(/^(?:-?(?:Infinity|[0-9]+(?:\.[0-9]+)?(?:e-?[0-9]+)?))$/)) {
                return Number(val);
            } else {
                throw new TypeError('[Nox-Lib] Invalid floatpoint: ' + val);
            }
        },

        /**
         * Parse integer type SillyTavern strings into a number datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Number} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted as a proper integer.
         */
        intParse(val) {
            if (val.match(/^(?:-?(?:[0-9]+))$/)) {
                return Number(val);
            } else {
                throw new TypeError('[Nox-Lib] Invalid integer: ' + val);
            }
        },

        /**
         * Parse JSON type SillyTavern strings into an object or array datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Object|Array<*>} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted in propper JSON syntax.
         */
        jsonParse(val) {
            try {
                return JSON.parse(val);
            } catch {
                throw new TypeError('[Nox-Lib] Invalid JSON: ' + val);
            }
        },

        /**
         * Parse YAML type SillyTavern strings into an object or array datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Object|Array<*>} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted in propper YAML syntax.
         */
        yamlParse(val) {
            try{
                return YAML.parse(val);
            } catch {
                throw new TypeError('[Nox-Lib] Invalid YAML: ' + val);
            }
        },

        /**
         * Paese any SillyTavern string into the appropriate datatype.
         * For the sake of performance, prioritize using specific datatype coercions/parsers over this one.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {*} - The coerced value.
         */
        valueParse(val) {
            try {
                return typeof val === 'object'
                    ? val
                    : JSON.parse(val);
            } catch {
                try {
                    return this.boolParse(val);
                } catch {
                    // Bool parsing failed. Try the next parsing.
                }

                try {
                    return this.floatParse(val);
                } catch {
                    // Number parsing failed. Keep the number as a string.
                }

                return val;
            }
        },

        /**
         * Parse any SillyTavern string into the appropriate datatype.
         * For the sake of performance, prioritize using specific datatype coercions/parsers over this one.
         *
         * This version offers YAML parsing implemented into the chain.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {*} - The coerced value.
         */
        valueYAMLParse(val) {
            try {
                return typeof val === 'object'
                    ? val
                    : JSON.parse(val);
            } catch {
                try {
                    return YAML.parse(val);
                } catch {
                    // YAML parsing failed. Try the next parsing method.
                }

                try {
                    return this.boolParse(val);
                } catch {
                    // Bool parsing failed. Try the next parsing method.
                }

                try {
                    return this.floatParse(val);
                } catch {
                    // Number parsing failed. Keep the number as a string.
                }

                return val;
            }
        },
    };
})();

/**
 * Sharable variable resolvers that can be reused as helper functions.
 */
const SharedResolvers = (() => {
    const
        { variables } = SillyTavern.getContext(),
        [
            getLocalVariable, setLocalVariable,
            getGlobalVariable, setGlobalVariable
        ] = [
            variables.local.get, variables.local.set,
            variables.global.get, variables.local.set
        ];

    return {
        /**
         * Resolves a local variable shorthand to it's associated variable's value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {*} - The resolved local variable's value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVar(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return value;
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {*} - The resolved local variable's parsed value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToValue(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.valueParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced string value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {String} - The resolved local variable's coerced string value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToString(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return String(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced boolean value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Boolean} - The resolved local variable's coerced boolean value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToLaxBool(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.boolCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced numeric value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Number} - The resolved local variable's coerced numeric value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToNum(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return Number(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed strict boolean value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Boolean} - The resolved local variable's parsed strict boolean value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToStrictBool(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.boolParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed floatpoint value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Number} - The resolved local variable's parsed floatpoint value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is
         */
        resolveLocalVarToFloat(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.floatParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed integer value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Number} - The resolved local variable's parsed integer value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToInt(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.intParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },


        /**
         * Resolves a local variable shorthand to it's associated variable's parsed JSON value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Object|Array<*>} - The resolved local variable's parsed JSON value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToJSON(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.jsonParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed YAML value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Object|Array<*>} - The resolved local variable's parsed YAML value.
         * *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToYAML(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.yamlParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed JSON value and makes it mutable.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed JSON object/array of the local variable and a function for updating the local variable.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToMutableJSON(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.jsonParse(value),
                    set = (/** @type {Object|Array<*>} */ list) => setLocalVariable(varName, JSON.stringify(list));

                return { getList: get(), setList: set };
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's parsed YAML value and makes it mutable.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed YAML object/array of the local variable and a function for updating the local variable.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToMutableYAML(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.yamlParse(value),
                    set = (/** @type {Object|Array<*>} */ list) => setLocalVariable(varName, YAML.stringify(list));

                return { getList: get(), setList: set };
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },



        /**
         * Resolves a global variable shorthand to it's associated variable's value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {*} - The resolved global variable's value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVar(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return value;
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {*} - The resolved global variable's parsed value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToValue(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.valueParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced string value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {String} - The resolved global variable's coerced string value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToString(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return String(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced boolean value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Boolean} - The resolved global variable's coerced boolean value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToLaxBool(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.boolCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced numeric value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Number} - The resolved global variable's coerced numeric value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToNum(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return Number(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed strict boolean value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Boolean} - The resolved global variable's parsed strict boolean value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToStrictBool(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.boolParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed floatpoint value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Number} - The resolved global variable's parsed floatpoint value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToFloat(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.floatParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed integer value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Number} - The resolved global variable's parsed integer value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToInt(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.intParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },


        /**
         * Resolves a global variable shorthand to it's associated variable's parsed JSON value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Object|Array<*>} - The resolved global variable's parsed JSON value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToJSON(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.jsonParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed YAML value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Object|Array<*>} - The resolved global variable's parsed YAML value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToYAML(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.yamlParse(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed JSON value and makes it mutable.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed JSON object/array of the global variable and a function for updating the global variable.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToMutableJSON(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.jsonParse(value),
                    set = (/** @type {Object|Array<*>} */ list) => setGlobalVariable(varName, JSON.stringify(list));

                return { getList: get(), setList: set };
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's parsed YAML value and makes it mutable.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed YAML object/array of the global variable and a function for updating the global variable.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToMutableYAML(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.yamlParse(value),
                    set = (/** @type {Object|Array<*>} */ list) => setGlobalVariable(varName, YAML.stringify(list));

                return { getList: get(), setList: set };
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },
    }
})();

/**
 * Variable shorthand resolver library.
 */
const VarShorthand = (() => {
    /**
     * Resolves a scope variable shorthand to it's associated variable's value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {*} - The resolved scope variable's value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVar(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return args._scope.getVariable(varName);
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {*} - The resolved scope variable's parsed value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToValue(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.valueParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced string value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {String} - The resolved scope variable's coerced string value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToString(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return String(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced boolean value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Boolean} - The resolved scope variable's coerced boolean value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToLaxBool(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.boolCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced numeric value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Number} - The resolved scope variable's coerced numeric value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToNum(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return Number(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed strict boolean value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Boolean} - The resolved scope variable's parsed strict boolean value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToStrictBool(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.boolParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed floatpoint value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Number} - The resolved scope variable's parsed floatpoint value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToFloat(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.floatParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed integer value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Number} - The resolved scope variable's parsed integer value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToInt(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.intParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }


    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed JSON value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Object} - The resolved scope variable's parsed JSON value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToJSON(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.jsonParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed YAML value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Object} - The resolved scope variable's parsed YAML value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToYAML(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.yamlParse(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed JSON value and makes it mutable.
     *
     * @param {String} varName - The name of the scope variable resolve to and make mutable.
     * @param {NamedArguments} args - The slash command named arguments and scope.
     * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed JSON object/array of the scope variable and a function for updating the scope variable.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToMutableJSON(varName, args) {
        if (args._scope.existsVariable(varName)) {
            const
                get = () => SharedValueCoercion.jsonParse(args._scope.getVariable(varName)),
                set = (/** @type {Object|Array<*>} */ list) => args._scope.setVariable(varName, JSON.stringify(list));

            return { getList: get(), setList: set };
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's parsed YAML value and makes it mutable.
     *
     * @param {String} varName - The name of the scope variable resolve to and make mutable.
     * @param {NamedArguments} args - The slash command named arguments and scope.
     * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The parsed YAML object/array of the scope variable and a function for updating the scope variable.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToMutableYAML(varName, args) {
        if (args._scope.existsVariable(varName)) {
            const
                get = () => SharedValueCoercion.yamlParse(args._scope.getVariable(varName)),
                set = (/** @type {Object|Array<*>} */ list) => args._scope.setVariable(varName, YAML.stringify(list));

            return { getList: get(), setList: set };
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    return {
        /**
         * Resolves a shorthand to it's associated variable's value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {*} - The shorthand's resolved value.
         */
        shorthandResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || varName == null) {
                return target;
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVar(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVar(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVar(varName);
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {*} - The shorthand's resolved parsed value.
         */
        shorthandValueResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || varName == null) {
                return SharedValueCoercion.valueParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToValue(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToValue(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToValue(varName);
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced string value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {String} - The shorthand's resolved coerced string value.
         */
        shorthandStringResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return target;
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToString(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToString(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToString(varName);
            }

            return ''; // Fucking type checks...
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced boolean value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Boolean} - The shorthand's resolved coerced boolean value.
         */
        shorthandLaxBoolResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.boolCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToLaxBool(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToLaxBool(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToLaxBool(varName);
            }

            return false;
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced numeric value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved coerced numeric value.
         */
        shorthandLaxNumResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return Number(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToNum(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToNum(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToNum(varName);
            }

            return NaN;
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed strict boolean value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Boolean} - The shorthand's resolved parsed strict boolean value.
         */
        shorthandStrictBoolResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.boolParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToStrictBool(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToStrictBool(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToStrictBool(varName);
            }

            return false;
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed floatpoint value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved parsed floatpoint value.
         */
        shorthandFloatResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.floatParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToFloat(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToFloat(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToFloat(varName);
            }

            return NaN;
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed integer value.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved parsed integer value.
         */
        shorthandIntResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.intParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToInt(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToInt(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToInt(varName);
            }

            return NaN;
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed JSON object/array.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Object|Array<*>} - The shorthand's resolved parsed JSON object/array.
         */
        shorthandJSONResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.jsonParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToJSON(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToJSON(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToJSON(varName);
            }

            return {"Error": "What the fuck...?"}
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed YAML object/array.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Object|Array<*>} - The shorthand's resolved parsed YAML object/array.
         */
        shorthandYAMLResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedValueCoercion.yamlParse(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToYAML(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToYAML(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToYAML(varName);
            }

            return {"Error": "What the fuck...?"}
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed JSON object/array. Adds mutability to the resolved variable.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {{getList: Object|*[], setList: (list: Object|*[]) => void}} The parsed JSON object/array of the scope variable and a function for updating the scope variable.
         */
        shorthandMutableJSONResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return {
                    getList: SharedValueCoercion.jsonParse(target),
                    setList: () => {}
                };
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToMutableJSON(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToMutableJSON(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToMutableJSON(varName);
            }

            return {
                getList: {"Error": "What the fuck...?"},
                setList: () => {
                    return {
                        "Error": `
                        I don't know who you are or how you got here,
                        but what I *DO* know is that *one* of us made a colossal fuck-up somewhere along the line.
                        `
                    }
                }
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed YAML object/array. Adds mutability to the resolved variable.
         *
         * @param {UnnamedArguments & String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {{getList: Object|*[], setList: (list: Object|*[]) => void}} The parsed YAML object/array of the scope variable and a function for updating the scope variable.
         */
        shorthandMutableYAMLResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return {
                    getList: SharedValueCoercion.yamlParse(target),
                    setList: () => {}
                };
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToMutableYAML(varName, args);
                case '.':
                    return SharedResolvers.resolveLocalVarToMutableYAML(varName);
                case '$':
                    return SharedResolvers.resolveGlobalVarToMutableYAML(varName);
            }

            return {
                getList: {"Error": "What the fuck...?"},
                setList: () => {
                    return {
                        "Error": `
                        I don't know who you are or how you got here,
                        but what I *DO* know is that *one* of us made a colossal fuck-up somewhere along the line.
                        `
                    }
                }
            }
        },
    };
})();

/**
 * The Coercion and Shorthand catagorey.
 * Contains all the library functions revolved around coercion and shorthands.
 */
const CoercionAndShorthand = {
    ValCoercion: SharedValueCoercion,
    VarShorthand: VarShorthand
};

export default CoercionAndShorthand;
export { SharedValueCoercion, SharedResolvers };
