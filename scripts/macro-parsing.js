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
 * Grab a local variable and parse it into a number.
 *
 * @param {String} varName - The name of the variable to get.
 * @returns {Number} - The parsed number.
 */
function getLocalNumberVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return Number(value);

    } else {
        throw new TypeError('No such variable: ' + varName + '(Local)');
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
        return Number(value);

    } else {
        throw new TypeError('No such variable: ' + varName + '(Global)');
    }
}



/**
 * Parse a value or variable into a number.
 * If the target is a variable name, it will be resolved to its value.
 *
 * @param {String} target - The target variable or value to parse.
 * @param {*} resolve
 * @returns {Number} - The parsed number
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
