import { parseValue, parseJSON, parseString, parseNumber, parseBoolean } from './parsing.js';
const { variables } = SillyTavern.getContext();

const [
    getLocalVariable, setLocalVariable,
    getGlobalVariable, setGlobalVariable
] = [
    variables.local.get, variables.local.set,
    variables.global.get, variables.global.set
];



/**
 * Grab a local variable and parse it into a value.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {*} - The parsed value.
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
 * Grab a local variable and parse it into a object/array.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getLocalJSONVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseJSON(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a local variable and parse it into a string.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {String} - The parsed value.
 */
function getLocalStringVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseString(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a local variable and parse it into a number.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Number} - The parsed number.
 */
function getLocalNumberVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseNumber(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a local variable and parse it into a boolean.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Boolean} - The parsed boolean.
 */
function getLocalBoolVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseBoolean(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a global variable and parse it into a value.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {*} - The parsed value.
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
 * Grab a global variable and parse it into a object/array.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getGlobalJSONVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseJSON(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a string.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {String} - The parsed value.
 */
function getGlobalStringVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseString(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a number.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Number} - The parsed number.
 */
function getGlobalNumberVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseNumber(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a boolean.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Boolean} - The parsed boolean.
 */
function getGlobalBoolVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseBoolean(value);

    } else {
        throw new Error('No such variable: ' + varName + '(Global)');
    }
}



/**
 * Parse a variable or resolve a value and pass it.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {String} - The parsed value.
 */
export function parseMacroVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return varArg;
    } else {
        return prefix === '.'
            ? getLocalVariable(varName)
            : getGlobalVariable(varName);
    }
}

/**
 * Parse a value or variable.
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
 * Parse a value or variable into a JSON object/array.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
export function parseMacroJSONOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return parseJSON(varArg);
    } else {
        return prefix === '.'
            ? getLocalJSONVar(varName)
            : getGlobalJSONVar(varName);
    }
}

/**
 * Parse a value or variable into a string.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {String} - The parsed value.
 */
export function parseMacroStringOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return String(varArg);
    } else {
        return prefix === '.'
            ? getLocalStringVar(varName)
            : getGlobalStringVar(varName);
    }
}

/**
 * Parse a value or variable into a number.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {Number} - The parsed number.
 */
export function parseMacroNumberOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return Number(varArg);
    } else {
        return prefix === '.'
            ? getLocalNumberVar(varName)
            : getGlobalNumberVar(varName);
    }
}

/**
 * Parse a value or variable into a boolean.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {Boolean} - The parsed boolean.
 */
export function parseMacroBoolOrVar(target, resolve) {
    let varArg = resolve(target);

    const [, prefix, varName] = varArg.match(/^([.$])?([-_a-zA-Z]+)$/) || [null, null, null];

    if (!prefix) {
        return Boolean(varArg);
    } else {
        return prefix === '.'
            ? getLocalBoolVar(varName)
            : getGlobalBoolVar(varName);
    }
}
