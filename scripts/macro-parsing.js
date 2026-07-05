import { parseValue, parseJSON } from './parsing.js';
const { variables } = SillyTavern.getContext();

const [
    getLocalVariable, setLocalVariable,
    getGlobalVariable, setGlobalVariable
] = [
    variables.local.get, variables.local.set,
    variables.global.get, variables.global.set
];

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
        throw new TypeError('No such variable: ' + varName + '(Local)');
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
        throw new TypeError('No such variable: ' + varName + '(Local)');
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
        throw new TypeError('No such variable: ' + varName + '(Global)');
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
        throw new TypeError('No such variable: ' + varName + '(Global)');
    }
}


/**
 * Parse a value or variable into a value.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {*} - The parsed value.
 */
export function parseMacroValueOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return parseValue(varArg);
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
 * @param {*} resolve
 * @returns {Object|Array<*>} - The parsed JSON object/array
 */
export function parseMacroJSONOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return parseJSON(varArg);
    } else {
        return prefix === '.'
            ? getLocalVarJSON(varName)
            : getGlobalVarJSON(varName);
    }
}
