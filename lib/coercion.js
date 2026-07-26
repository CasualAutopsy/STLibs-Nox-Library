// @ts-nocheck
/**
 * @typedef {import('/scripts/slash-commands/SlashCommand.js').NamedArguments} NamedArguments
 * @typedef {import('/scripts/slash-commands/SlashCommand.js').UnnamedArguments} UnnamedArguments
 */

/**
 * Sharable value coercion functions that can be reused as helper functions.
 *
 * @method `stringCoercion` - Coerce any value into a string datatype.
 * @method `laxBoolCoercion` - Coerce boolean type SillyTavern strings into a bool datatype.
 * @method `strictBoolCoercion` - Coerce boolean type SillyTavern strings into a strict bool datatype.
 * @method `laxNumCoercion` - Coerce any SillyTavern string value into a number datatype.
 * @method `strictFloatCoercion` - Coerce floatpoint type SillyTavern strings into a number datatype.
 * @method `strictIntCoercion` - Coerce integer type SillyTavern strings into a number datatype.
 * @method `jsonCoercion` - Coerce any SillyTavern string value into an object or array datatype.
 * @method `valueCoercion` - Coerce any SillyTavern string into the appropriate datatype.
 */
const SharedValueCoercion = (() => {
    return {
        /**
         * Coerce any value into a string datatype.
         * Generally unneeded unless you need to convert a value back into a string to perform string operations.
         *
         * @param {*} val - The value to perform coercion on.
         * @returns {String} - The coerced value.
         */
        stringCoercion(val) {
            return String(val);
        },

        /**
         * Coerce any SillyTavern string value into a bool datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Boolean} - The coerced value.
         */
        laxBoolCoercion(val) {
            return !['false', '0', 'off', ''].includes(val?.trim()?.toLowerCase());
        },

        /**
         * Coerce boolean type SillyTavern strings into a strict bool datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Boolean} - The coerced value.
         */
        strictBoolCoercion(val) {
            if (['true', 'false', 'on', 'off'].includes(val?.trim()?.toLowerCase()) === true) {
                return laxBoolCoercion(val);
            } else {
                throw new TypeError('[Nox-Lib] Invalid boolean: ' + val);
            }
        },

        /**
         * Coerce any SillyTavern string value into a number datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Number} - The coerced value.
         */
        laxNumCoercion(val) {
            return Number(val);
        },


        /**
         * Coerce floatpoint type SillyTavern strings into a number datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Number} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted as a proper floatpoint.
         */
        strictFloatCoercion(val) {
            if (val.match(/^(?:-?(?:Infinity|[0-9]+(?:\.[0-9]+)?(?:e-?[0-9]+)?))$/)) {
                return laxNumCoercion(val);
            } else {
                throw new TypeError('[Nox-Lib] Invalid floatpoint: ' + val);
            }
        },

        /**
         * Coerce integer type SillyTavern strings into a number datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Number} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted as a proper integer.
         */
        strictIntCoercion(val) {
            if (val.match(/^(?:-?(?:[0-9]+))$/)) {
                return laxNumCoercion(val);
            } else {
                throw new TypeError('[Nox-Lib] Invalid integer: ' + val);
            }
        },

        /**
         * Coerce JSON type SillyTavern strings into an object or array datatype.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {Object|Array<*>} - The coerced value.
         *
         * @throws {TypeError} - Throws a TypeError if the string is not formatted in propper JSON syntax.
         */
        jsonCoercion(val) {
            try {
                return JSON.parse(val);
            } catch {
                throw new TypeError('[Nox-Lib] Invalid JSON: ' + val);
            }
        },

        /**
         * Corece any SillyTavern string into the appropriate datatype.
         * For the sake of performance, prioritize using specific datatype coercions over this one.
         *
         * @param {String} val - The string to perform coercion on.
         * @returns {*} - The coerced value.
         */
        valueCoercion(val) {
            try {
                return jsonCoercion(val);
            } catch {
                try {
                    return strictBoolCoercion(val);
                } catch {
                    // Bool coercion failed. Try the next coercion.
                }

                try {
                    return strictFloatCoercion(val);
                } catch {
                    // Number coercion failed. Keep the number as a string.
                }

                return val;
            }
        },
    };
})();

/**
 * Sharable variable resolvers that can be reused as helper functions.
 *
 * ===**Local Variables**===
 * @method `resolveLocalVar` - Resolves a local variable shorthand to it's associated variable's value.
 * @method `resolveLocalVarToValue` - Resolves a local variable shorthand to it's associated variable's coerced value.
 * @method `resolveLocalVarToString` - Resolves a local variable shorthand to it's associated variable's coerced string value.
 * @method `resolveLocalVarToLaxBool` - Resolves a local variable shorthand to it's associated variable's coerced boolean value.
 * @method `resolveLocalVarToLaxNum` - Resolves a local variable shorthand to it's associated variable's coerced numeric value.
 * @method `resolveLocalVarToStrictBool` - Resolves a local variable shorthand to it's associated variable's coerced strict boolean value.
 * @method `resolveLocalVarToFloat` - Resolves a local variable shorthand to it's associated variable's coerced floatpoint value.
 * @method `resolveLocalVarToInt` - Resolves a local variable shorthand to it's associated variable's coerced integer value.
 * @method `resolveLocalVarToJSON` - Resolves a local variable shorthand to it's associated variable's coerced JSON value.
 * @method `resolveLocalVarToMutableJSON` - Resolves a local variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
 *
 * ===**Global Variables**===
 * @method `resolveGlobalVar` - Resolves a global variable shorthand to it's associated variable's value.
 * @method `resolveGlobalVarToValue` - Resolves a global variable shorthand to it's associated variable's coerced value.
 * @method `resolveGlobalVarToString` - Resolves a global variable shorthand to it's associated variable's coerced string value.
 * @method `resolveGlobalVarToLaxBool` - Resolves a global variable shorthand to it's associated variable's coerced boolean value.
 * @method `resolveGlobalVarToLaxNum` - Resolves a global variable shorthand to it's associated variable's coerced numeric value.
 * @method `resolveGlobalVarToStrictBool` - Resolves a global variable shorthand to it's associated variable's coerced strict boolean value.
 * @method `resolveGlobalVarToFloat` - Resolves a global variable shorthand to it's associated variable's coerced floatpoint value.
 * @method `resolveGlobalVarToInt` - Resolves a global variable shorthand to it's associated variable's coerced integer value.
 * @method `resolveGlobalVarToJSON` - Resolves a global variable shorthand to it's associated variable's coerced JSON value.
 * @method `resolveGlobalVarToMutableJSON` - Resolves a global variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
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
         * Resolves a local variable shorthand to it's associated variable's coerced value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {*} - The resolved local variable's coerced value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToValue(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.valueCoercion(value);
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
                return SharedValueCoercion.stringCoercion(value);
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
                return SharedValueCoercion.laxBoolCoercion(value);
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
        resolveLocalVarToLaxNum(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.laxNumCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced strict boolean value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Boolean} - The resolved local variable's coerced strict boolean value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToStrictBool(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictBoolCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced floatpoint value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Number} - The resolved local variable's coerced floatpoint value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is
         */
        resolveLocalVarToFloat(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictFloatCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced integer value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Number} - The resolved local variable's coerced integer value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToInt(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictIntCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },

        /**
         * Resolves a local variable shorthand to it's associated variable's coerced JSON value.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {Object|Array<*>} - The resolved local variable's coerced JSON value.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToJSON(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.jsonCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Local)');
            }
        },


        /**
         * Resolves a local variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
         *
         * @param {String} varName - The name of the local variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The coerced JSON object/array of the local variable and a function for updating the local variable.
         *
         * @throws {Error} - Throws an error if the local variable does not exist or is empty.
         */
        resolveLocalVarToMutableJSON(varName) {
            const value = getLocalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.jsonCoercion(value),
                    set = (/** @type {Object|Array<*>} */ list) => setLocalVariable(varName, JSON.stringify(list));

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
         * Resolves a global variable shorthand to it's associated variable's coerced value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {*} - The resolved global variable's coerced value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToValue(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.valueCoercion(value);
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
                return SharedValueCoercion.stringCoercion(value);
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
                return SharedValueCoercion.laxBoolCoercion(value);
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
        resolveGlobalVarToLaxNum(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.laxNumCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced strict boolean value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Boolean} - The resolved global variable's coerced strict boolean value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToStrictBool(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictBoolCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced floatpoint value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Number} - The resolved global variable's coerced floatpoint value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToFloat(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictFloatCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced integer value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Number} - The resolved global variable's coerced integer value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToInt(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.strictIntCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

        /**
         * Resolves a global variable shorthand to it's associated variable's coerced JSON value.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {Object|Array<*>} - The resolved global variable's coerced JSON value.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToJSON(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                return SharedValueCoercion.jsonCoercion(value);
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },


        /**
         * Resolves a global variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
         *
         * @param {String} varName - The name of the global variable to resolve to.
         * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The coerced JSON object/array of the global variable and a function for updating the global variable.
         *
         * @throws {Error} - Throws an error if the global variable does not exist or is empty.
         */
        resolveGlobalVarToMutableJSON(varName) {
            const value = getGlobalVariable(varName);

            if (value !== '') {
                const
                    get = () => SharedValueCoercion.jsonCoercion(value),
                    set = (/** @type {Object|Array<*>} */ list) => setGlobalVariable(varName, JSON.stringify(list));

                return { getList: get(), setList: set };
            } else {
                throw new Error('[Nox-Lib] No such variable: ' + varName + '(Global)');
            }
        },

    }
})();

/**
 * Variable shorthand resolver library.
 * @method `shorthandResolver` - Resolves a variable shorthand to it's associated variable's value.
 * @method `shorthandValueResolver` - Resolves a variable shorthand to it's associated variable's coerced value.
 * @method `shorthandStringResolver` - Resolves a variable shorthand to it's associated variable's coerced string value.
 * @method `shorthandLaxBoolResolver` - Resolves a variable shorthand to it's associated variable's coerced boolean value.
 * @method `shorthandLaxNumResolver` - Resolves a variable shorthand to it's associated variable's coerced numeric value.
 * @method `shorthandStrictBoolResolver` - Resolves a variable shorthand to it's associated variable's coerced strict boolean value.
 * @method `shorthandFloatResolver` - Resolves a variable shorthand to it's associated variable's coerced floatpoint value.
 * @method `shorthandIntResolver` - Resolves a variable shorthand to it's associated variable's coerced integer value.
 * @method `shorthandJSONResolver` - Resolves a variable shorthand to it's associated variable's coerced JSON value.
 * @method `shorthandMutableJSONResolver` - Resolves a variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
 */
const VarShorthand = (() => {
    const
        { variables } = SillyTavern.getContext(),
        [
            getLocalVariable, setLocalVariable,
            getGlobalVariable, setGlobalVariable
        ] = [
            variables.local.get, variables.local.set,
            variables.global.get, variables.local.set
        ];

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
     * Resolves a scope variable shorthand to it's associated variable's coerced value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {*} - The resolved scope variable's coerced value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToValue(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.valueCoercion(args._scope.getVariable(varName));
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
            return SharedValueCoercion.stringCoercion(args._scope.getVariable(varName));
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
            return SharedValueCoercion.laxBoolCoercion(args._scope.getVariable(varName));
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
    function resolveScopeVarToLaxNum(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.laxNumCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced strict boolean value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Boolean} - The resolved scope variable's coerced strict boolean value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToStrictBool(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.strictBoolCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced floatpoint value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Number} - The resolved scope variable's coerced floatpoint value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToFloat(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.strictFloatCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced integer value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Number} - The resolved scope variable's coerced integer value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToInt(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.strictIntCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced JSON value.
     *
     * @param {String} varName - The name of the scope variable to resolve to.
     * @param {NamedArguments} args - Slash command named arguments and scope.
     * @returns {Object} - The resolved scope variable's coerced JSON value.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToJSON(varName, args) {
        if (args._scope.existsVariable(varName)) {
            return SharedValueCoercion.jsonCoercion(args._scope.getVariable(varName));
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }


    /**
     * Resolves a scope variable shorthand to it's associated variable's coerced JSON value and makes it mutable.
     *
     * @param {String} varName - The name of the scope variable resolve to and make mutable.
     * @param {NamedArguments} args - The slash command named arguments and scope.
     * @returns {{getList: Object|Array<*>, setList: (list: Object|Array<*>) => void}} - The coerced JSON object/array of the scope variable and a function for updating the scope variable.
     *
     * @throws {Error} - Throws an error if the variable does not exist in the scope.
     */
    function resolveScopeVarToMutableJSON(varName, args) {
        if (args._scope.existsVariable(varName)) {
            const
                get = () => SharedValueCoercion.jsonCoercion(args._scope.getVariable(varName)),
                set = (/** @type {Object|Array<*>} */ list) => args._scope.setVariable(varName, JSON.stringify(list));

            return { list: get(), setList: set };
        } else {
            throw new Error('[Nox-Lib] No such variable: ' + varName + '(Scope)');
        }
    }

    return {
        /**
         * Resolves a shorthand to it's associated variable's value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {*} - The shorthand's resolved value.
         */
        shorthandResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return target;
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVar(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVar(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVar(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {*} - The shorthand's resolved coerced value.
         */
        shorthandValueResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.valueCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToValue(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToValue(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToValue(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced string value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {String} - The shorthand's resolved coerced string value.
         */
        shorthandStringResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.stringCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToString(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToString(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToString(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced boolean value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Boolean} - The shorthand's resolved coerced boolean value.
         */
        shorthandLaxBoolResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.laxBoolCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToLaxBool(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToLaxBool(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToLaxBool(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced numeric value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved coerced numeric value.
         */
        shorthandLaxNumResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.laxNumCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToLaxNum(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToLaxNum(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToLaxNum(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced strict boolean value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Boolean} - The shorthand's resolved coerced strict boolean value.
         */
        shorthandStrictBoolResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.strictBoolCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToStrictBool(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToStrictBool(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToStrictBool(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced floatpoint value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved coerced floatpoint value.
         */
        shorthandFloatResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.strictFloatCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToFloat(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToFloat(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToFloat(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced integer value.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Number} - The shorthand's resolved coerced integer value.
         */
        shorthandIntResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.strictIntCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToInt(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToInt(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToInt(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced JSON object/array.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {Object|Array<*>} - The shorthand's resolved coerced JSON object/array.
         */
        shorthandJSONResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedValueCoercion.jsonCoercion(target);
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToJSON(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToJSON(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToJSON(varName);
                    break;
            }
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced JSON object/array. Adds mutability to the resolved variable.
         *
         * @param {UnnamedArguments|String} target - The shorthand to resolve.
         * @param {NamedArguments} args - Slash command named arguments and scope.
         * @returns {{getList: Object|*[], setList: (list: Object|*[]) => void}} An object containing the resolved JSON object/array and a function to update the resolved variable's value.
         */
        shorthandMutableJSONResolver(target, args) {
            const [, prefix, varName] = target.match(/^([@.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return {
                    getList: SharedValueCoercion.jsonCoercion(target),
                    setList: () => {}
                };
            }

            switch (prefix) {
                case '@':
                    return resolveScopeVarToMutableJSON(varName, args);
                    break;
                case '.':
                    return SharedResolvers.resolveLocalVarToMutableJSON(varName);
                    break;
                case '$':
                    return SharedResolvers.resolveGlobalVarToMutableJSON(varName);
                    break;
            }
        },
    };
})();

/**
 * The Coercion and Shorthand catagorey.
 * Contains all the library functions revolved around coercion and shorthands.
 *
 * @prop `ValCoercion` - Value coercion library.
 * @prop `VarShorthand` - Variable shorthand library.
 */
const CoercionAndShorthand = {
    ValCoercion: SharedValueCoercion,
    VarShorthand: VarShorthand
};

export { CoercionAndShorthand, SharedValueCoercion, SharedResolvers };
