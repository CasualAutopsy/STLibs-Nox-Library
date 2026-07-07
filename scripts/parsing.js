// @ts-nocheck
const { isTrueBoolean } = await import(/* webpackIgnore: true */ '/scripts/utils.js');
const { variables } = SillyTavern.getContext();

const [
    getLocalVariable, setLocalVariable,
    getGlobalVariable, setGlobalVariable
] = [
    variables.local.get, variables.local.set,
    variables.global.get, variables.global.set
];

// VALUE PARSING

/**
 * Parses a value into a JSON object/array.
 *
 * @param {string} value - The value to parse.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
export function parseJSON(value) {

    try {
        return typeof value == 'object'
            ? value
            : JSON.parse(value);

    } catch {
        throw new Error('Invalid JSON: ' + value);
    }
}

/**
 * Parses a value into a number, boolean, string, or object/array.
 *
 * @param {String} value - The value to parse.
 * @returns {*} - The parsed value.
 */
export function parseValue(value) {

    try {
        return typeof value == 'object'
            ? value
            : JSON.parse(value);

    } catch {
        if (value === 'true' || value === 'false') {
            return isTrueBoolean(value);
        }

        const numericValue = Number(value);

        if (!Number.isNaN(numericValue)) {
            return numericValue;
        }

        return value;
    }
}

/**
 * Parses a value into a boolean.
 *
 * @param {String} value - The value to parse.
 * @returns {Boolean} - The parsed boolean.
 */
export function parseBoolean(value) {
    if (value === 'true' || value === 'false') {
        return isTrueBoolean(value);
    } else {
        throw new Error('Invalid boolean: ' + value);
    }
}

/**
 * Parses a value into a string.
 *
 * @param {String} value - The value to parse.
 * @returns {String} - The parsed string.
 */
export function parseString(value) {
    return String(value);
}

/**
 * Parses a value into a number.
 *
 * @param {String} value - The value to parse.
 * @returns {Number} - The parsed number.
 */
export function parseNumber(value) {
    const numericValue = Number(value);

    if (!Number.isNaN(numericValue)) {
        return numericValue;
    } else {
        throw new Error('Invalid number: ' + value);
    }
}

// VARIABLE HANDLING

/**
 * Grab a scope variable from slash command scope and parse it into the appropriate data type.
 *
 * @param {String} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {*} - The value of the variable.
 */
function getScopeVar(varName, args) {

    if (args._scope.existsVariable(varName)) {
        return parseValue(args._scope.getVariable(varName));

    } else {
        throw new Error('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a scope variable from slash command scope and parse it into a JSON object/array.
 *
 * @param {String} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getScopeVarJSON(varName, args) {

    if (args._scope.existsVariable(varName)) {
        return parseJSON(args._scope.getVariable(varName));

    } else {
        throw new Error('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a scope variable from slash command scope and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {String} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): String}} - The parsed JSON object/array of the variable and a function for updating the variable.
 */
function getMutableScopeVar(varName, args) {

    if (args._scope.existsVariable(varName)) {
        const
            get = () => parseJSON(args._scope.getVariable(varName)),
            set = (/** @type {Object|Array<*>} */ list) => args._scope.setVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };
    } else {
        throw new Error('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a local variable and parse it into the appropriate data type.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {*} - The value of the variable.
 */
function getLocalVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseValue(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a local variable and parse it into a JSON object/array.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getLocalVarJSON(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseJSON(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }

}

/**
 * Grab a local variable and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): String}} - The parsed JSON object/array of the variable and a function for updating the variable.
 */
function getMutableLocalVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        const
            get = () => parseJSON(value),
            set = (/** @type {Object|Array<*>} */ list) => setLocalVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a global variable and parse it into the appropriate data type.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {*} - The value of the variable.
 */
function getGlobalVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseValue(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a JSON object/array.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Object|Array<*>} The parsed JSON object/array.
 */
function getGlobalVarJSON(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseJSON(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): String}} - The parsed JSON object/array and a function for updating the variable.
 */
function getMutableGlobalVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        const
            get = () => parseJSON(value),
            set = (/** @type {Object|Array<*>} */ list) => setGlobalVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

// SHORTHAND PARSING

/**
 * Parse a value or variable into a value.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {*} - The parsed value.
 */
export function parseValueOrVar(target, args) {
    const [, prefix, varName] = target.match(/^([:.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return parseValue(target);

    } else if (prefix === ':') {
        return getScopeVar(varName, args);

    } else {
        return prefix === '.'
            ? getLocalVar(varName)
            : getGlobalVar(varName);
    }
}

/**
 * Parse a JSON string or variable into a JSON object/array.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value string to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {Object|Array<*>} - The parsed JSON object/array
 */
export function parseJSONOrVar(target, args) {
    const [, prefix, varName] = target.match(/^([:.$])?([-_a-zA-Z]+)$/);


    if (!prefix) {
        return parseJSON(target);
    }


    if (prefix === ':') {
        return getScopeVarJSON(varName, args);

    } else {
        return prefix === '.'
            ? getLocalVarJSON(varName)
            : getGlobalVarJSON(varName);
    }
}

/**
 * Parse a value or variable into a value.
 * If the target is a variable name, it will be resolved to its value.
 * Allows mutability of the variable.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {{list: Object|Array<*>, setList: (function(Object|Array<*>): String)}} - The parsed JSON object/array and a function to update the variable.
 */
export function mutableParseValueOrVar(target, args) {
    const [, prefix, varName] = target.match(/^([:.$])?([-_a-zA-Z]+)$/);


    if (!prefix) {
        const
            get = () => parseJSON(target),
            set = () => {};

        return { list: get(), setList: set };
    }


    if (prefix === ':') {
        return getMutableScopeVar(varName, args);

    } else {
        return prefix === '.'
            ? getMutableLocalVar(varName)
            : getMutableGlobalVar(varName);
    }
}
