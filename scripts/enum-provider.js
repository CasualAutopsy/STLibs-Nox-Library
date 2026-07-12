// @ts-nocheck
const { enumIcons } = await import(/* webpackIgnore: true */ '../../../../slash-commands/SlashCommandCommonEnumsProvider.js');
const { enumTypes } = await import(/* webpackIgnore: true */ '../../../../slash-commands/SlashCommandEnumValue.js');

const {
    chatMetadata, extensionSettings,
    SlashCommandEnumValue
} = SillyTavern.getContext(),

[
    chat_metadata,
    extension_settings
] = [
    chatMetadata,
    extensionSettings
];


/**
 * @typedef {import('../../../../slash-commands/SlashCommandExecutor.js').SlashCommandExecutor} SlashCommandExecutor
 * @typedef {import('../../../../slash-commands/SlashCommandScope.js').SlashCommandScope} SlashCommandScope
 * @typedef {import('../../../../slash-commands/SlashCommandEnumValue.js').SlashCommandEnumValue} SlashCommandEnumValue
 */

function objectCheck(input) {
    try {
        const obj = JSON.parse(input);
        return typeof obj === 'object' && !Array.isArray(obj);
    } catch {
        return false;
    }
}

export const noxEnumProvider = {
    /**
     * All possible variable names
     * Can be filtered by `type` to only show global or local variables
     *
     * @param {('shorthand'|'shorthand-w-scope')} type - The type of variables to include in the array. Can be 'all', 'global', or 'local'.
     * @returns {(executor:SlashCommandExecutor, scope:SlashCommandScope) => SlashCommandEnumValue[]}
     */
    shorthand: (type) => (_, scope) => {
        return [

            ...type.includes('shorthand-w-scope')
                ? scope.allVariableNames.map(
                    name => new SlashCommandEnumValue(':' + name, null, enumTypes.variable, enumIcons.scopeVariable)
                ): [],

            ...type.includes('shorthand') ||
            type.includes('shorthand-w-scope')
                ? Object.keys(chat_metadata.variables ?? []).map(
                    name => new SlashCommandEnumValue('.' + name, null, enumTypes.name, enumIcons.localVariable)
                ) : [],

            ...type.includes('shorthand') ||
            type.includes('shorthand-w-scope')
                ? Object.keys(extension_settings.variables.global ?? []).map(
                    name => new SlashCommandEnumValue('$' + name, null, enumTypes.macro, enumIcons.globalVariable)
                ) : [],

        ].filter((item, idx, list) => idx == list.findIndex(it => it.value == item.value));
    },

    /**
     *
     * @param {('shorthand'|'shorthand-w-scope')} shorthand
     * @param {...('string'|'number'|'boolean'|'array'|'object'|'all')} type
     * @returns {(executor:SlashCommandExecutor, scope:SlashCommandScope) => SlashCommandEnumValue[]}
     */
    shorthandAndValue: (shorthand, ...type) => (_, scope) => {
        const types = type.flat()
            , isAll = types.includes('all');

        return [

            ...isAll || types.includes('string')
                ? [new SlashCommandEnumValue(
                    'any string',
                    'Everything starts as a string and must be casted.',
                    enumTypes.enum,
                    enumIcons.string,
                    (_) => {
                        return true;
                    },
                    (input) => input,
                )] : [],

            ...isAll || types.includes('number')
                ? [new SlashCommandEnumValue(
                    'any number',
                    null,
                    enumTypes.enum,
                    enumIcons.number,
                    (input) => input == '' || !Number.isNaN(Number(input)),
                    (input) => input,
                )] : [],

            ...isAll || types.includes('boolean')
                ? [new SlashCommandEnumValue(
                    'any boolean',
                    null,
                    enumTypes.enum,
                    enumIcons.boolean,
                    (input) => input == '' || input.match(/^(t(r|ru|rue)?|f(a|al|als|alse)?)$/),
                    (input) => input,
                )] : [],

            ...isAll || types.includes('array')
                ? [new SlashCommandEnumValue(
                    'any array',
                    null,
                    enumTypes.enum,
                    enumIcons.array,
                    (input) => input == '' || Array.isArray(Array(input)),
                    (input) => input,
                )] : [],

            ...isAll || types.includes('object')
                ? [new SlashCommandEnumValue(
                    'any object',
                    null,
                    enumTypes.enum,
                    enumIcons.dictionary,
                    (input) => input == '' || objectCheck(input),
                )] : [],


            ...shorthand.includes('shorthand-w-scope')
                ? scope.allVariableNames.map(
                    name => new SlashCommandEnumValue(':' + name, null, enumTypes.variable, enumIcons.scopeVariable)
                ) : [],

            ...shorthand.includes('shorthand') ||
            shorthand.includes('shorthand-w-scope')
                ? Object.keys(chat_metadata.variables ?? []).map(
                    name => new SlashCommandEnumValue('.' + name, null, enumTypes.name, enumIcons.localVariable)
                ) : [],

            ...shorthand.includes('shorthand') ||
            shorthand.includes('shorthand-w-scope')
                ? Object.keys(extension_settings.variables.global ?? []).map(
                    name => new SlashCommandEnumValue('$' + name, null, enumTypes.macro, enumIcons.globalVariable)
                ) : [],

        ].filter((item, idx, list) => idx == list.findIndex(it => it.value == item.value));
    },

    /**
     *
     * @returns {(executor:SlashCommandExecutor, scope:SlashCommandScope) => SlashCommandEnumValue[]}
     */
    discoreWidgetTypes: () => (_, scope) => {
        return [
            new SlashCommandEnumValue(
                '1',
                'String Datatype',
                enumTypes.enum,
                enumIcons.string,
            ),

            new SlashCommandEnumValue(
                '2',
                'Number Datatype',
                enumTypes.enum,
                enumIcons.number,
            ),

            new SlashCommandEnumValue(
                '3',
                'Media URL',
                enumTypes.enum,
                enumIcons.image,
            ),
        ].filter((item, idx, list) => idx == list.findIndex(it => it.value == item.value));
    }
};

