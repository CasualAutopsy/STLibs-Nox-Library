// @ts-nocheck
import {SharedValueCoercion, SharedResolvers} from './coercion.js';

/**
 * @typedef {(text: String, options: { offsetDelta: Number }) => String} MacroResolver
 */

export const VarShorthand = (() => {
    const
        { variables } = SillyTavern.getContext(),
        [
            getLocalVariable, setLocalVariable,
            getGlobalVariable, setGlobalVariable
        ] = [
            variables.local.get, variables.local.set,
            variables.global.get, variables.local.set
        ];

    const SharedLibs = {
        ValCoercion: SharedValueCoercion,
        Resolvers: SharedResolvers
    }

    return {
        /**
         *
         * @param {String} target
         * @param {MacroResolver} resolve
         * @returns {*}
         */
        shorthandResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return value;
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVar(varName)
                : SharedLibs.Resolvers.resolveGlobalVar(varName);
        },

        shorthandValueResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.valueCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToValue(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToValue(varName);
        },

        shorthandStringResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.stringCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToString(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToString(varName);
        },

        shorthandLaxBoolResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.laxBoolCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToLaxBool(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToLaxBool(varName);
        },

        shorthandLaxNumResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.laxNumCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToLaxNum(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToLaxNum(varName);
        },

        shorthandStrictBoolResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.strictBoolCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToStrictBool(varName)
                : SharedLibs.Resolvers.resolveLocalVarToStrictBool(varName);
        },

        shorthandFloatResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.strictFloatCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToFloat(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToFloat(varName);
        },

        shorthandIntResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.strictIntCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToInt(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToInt(varName);
        },

        shorthandJSONResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return SharedLibs.ValCoercion.jsonCoercion(target);
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToJSON(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToJSON(varName);
        },

        shorthandMutableJSONResolver(target, resolve) {
            const
                value = resolve(target),
                [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

            if (!prefix) {
                return {
                    getList: SharedLibs.ValCoercion.jsonCoercion(target),
                    setList: () => {}
                };
            }

            return prefix === '.'
                ? SharedLibs.Resolvers.resolveLocalVarToMutableJSON(varName)
                : SharedLibs.Resolvers.resolveGlobalVarToMutableJSON(varName);
        },
    };
})();

const MacroCoercionAndShorthand = {
    ValCoercion: SharedValueCoercion,
    VarShorthand: VarShorthand
};

export { MacroCoercionAndShorthand };
