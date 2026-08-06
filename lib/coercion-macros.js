import {SharedValueCoercion, SharedResolvers} from './coercion.js';

/**
 * @typedef {(text: String, options?: { offsetDelta: Number }) => String} MacroResolver
 */

export const VarShorthand = (() => {
    const SharedLibs = {
        ValCoercion: SharedValueCoercion,
        Resolvers: SharedResolvers
    }

    return {
        /**
         * Resolves a shorthand to it's associated variable's value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {*} The shorthand's resolved value.
         */
        shorthandResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return value;
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVar(varName)
                : SharedLibs.Resolvers.resolveGlobalVar(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {*} The shorthand's resolved parsed value.
         */
        shorthandValueResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.valueParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToValue(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToValue(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced string value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {String} The shorthand's resolved coerced string value.
         */
        shorthandStringResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.stringCoercion(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToString(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToString(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced boolean value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Boolean} The shorthand's resolved coerced boolean value.
         */
        shorthandLaxBoolResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.boolCoercion(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToLaxBool(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToLaxBool(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's coerced numeric value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Number} The shorthand's resolved coerced numeric value.
         */
        shorthandLaxNumResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.numCoercion(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToNum(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToNum(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed strict boolean value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Boolean} The shorthand's resolved parsed strict boolean value.
         */
        shorthandStrictBoolResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.boolParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToStrictBool(varName)
                : SharedLibs.Resolvers.resolveLocalVarToStrictBool(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed floatpoint value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Number} The shorthand's resolved parsed floatpoint value.
         */
        shorthandFloatResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.floatParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToFloat(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToFloat(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed integer value.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Number} The shorthand's resolved parsed integer value.
         */
        shorthandIntResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.intParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToInt(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToInt(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed JSON object/array.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Object|Array<*>} The shorthand's resolved parsed JSON object/array.
         */
        shorthandJSONResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/)|| [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.jsonParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToJSON(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToJSON(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed YAML object/array.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function.
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {Object|Array<*>} The shorthand's resolved parsed YAML object/array.
         */
        shorthandYAMLResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/)|| [null, null, null];

            if (!prefix || !varName) {
                return SharedLibs.ValCoercion.yamlParse(value);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToYAML(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToYAML(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed JSON object/array. Adds mutability to the resolved variable.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {{getList: Object|*[], setList: (list: Object|*[]) => void}} The parsed JSON object/array of the scope variable and a function for updating the scope variable.
         */
        shorthandMutableJSONResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return {
                    getList: SharedLibs.ValCoercion.jsonParse(value),
                    setList: () => {}
                };
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToMutableJSON(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToMutableJSON(varName);
        },

        /**
         * Resolves a shorthand to it's associated variable's parsed YAML object/array. Adds mutability to the resolved variable.
         *
         * @param {String} target - The shorthand to resolve.
         * @param {MacroResolver} resolve - The resolver function
         * @param {Boolean} delayed - Whether or not the macro has delayed resolving for the scoped content.
         *
         * @returns {{getList: Object|*[], setList: (list: Object|*[]) => void}} The parsed YAML object/array of the scope variable and a function for updating the scope variable.
         */
        shorthandMutableYAMLResolver(target, resolve, delayed = false) {
            const
                value = delayed === true
                    ? resolve(target)
                    : target,
                [, prefix, varName] = value.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

            if (!prefix || !varName) {
                return {
                    getList: SharedLibs.ValCoercion.yamlParse(value),
                    setList: () => {}
                };
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToMutableYAML(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToMutableYAML(varName);
        }
    };
})();

const MacroCoercionAndShorthand = {
    ValCoercion: SharedValueCoercion,
    VarShorthand: VarShorthand
};

export { MacroCoercionAndShorthand };
