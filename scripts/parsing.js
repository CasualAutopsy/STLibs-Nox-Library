const {isTrueBoolean} = await import(/* webpackIgnore: true */ '/scripts/utils.js');

const {
    getLocalVariable,
    setLocalVariable,
    getGlobalVariable,
    setGlobalVariable
} = await import(/* webpackIgnore: true */ '/scripts/variables.js');

// VALUE PARSING

/**
 * Parses a value into a JSON object/array.
 *
 * @param {string} value - The value to parse.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
export function parseJSON(value) {
    try { // Attempt to parse the value as JSON
        return typeof value == 'object' // Check if the value is a JSON or a JSON string
            ? value
            : JSON.parse(value);
    } catch { // If parsing fails, throw an error
        throw new TypeError('Invalid JSON: ' + value);
    }
}

/**
 * Parses a value into a number, boolean, string, or object/array.
 *
 * @param {string} value - The value to parse.
 * @returns {*} - The parsed value.
 */
export function parseValue(value) {
    // Try JSON parsing first (handles objects, arrays, numbers, booleans, null)
    try {
        return parseJSON(value);
    } catch {
        // Try numeric conversion for plain numbers
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            return numericValue;
        }
        // Handle boolean strings
        if (value === 'true' || value === 'false') {
            return isTrueBoolean(value);
        }
        // Return as string if no other conversion succeeds
        return value;
    }
}

// VARIABLE HANDLING

/**
 * Grab a scope variable from slash command scope and parse it into the appropriate data type.
 *
 * @param {string} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {*} - The value of the variable.
 */
function getScopeVar(varName, args) {
    // @ts-ignore
    if (args._scope.existsVariable(varName)) {
        // @ts-ignore
        return parseValue(args._scope.getVariable(varName));
    } else { // If the variable doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a scope variable from slash command scope and parse it into a JSON object/array.
 *
 * @param {string} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getScopeVarJSON(varName, args) {
    // @ts-ignore
    if (args._scope.existsVariable(varName)) {
        // @ts-ignore
        return parseJSON(args._scope.getVariable(varName));
    } else { // If the variable doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a scope variable from slash command scope and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {string} varName - The name of the variable to get.
 * @param {Object} args - Slash command arguments.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): string}} - The parsed JSON object/array of the variable and a function for updating the variable.
 */
function getMutableScopeVar(varName, args) {
    // @ts-ignore
    if (args._scope.existsVariable(varName)) {
        // @ts-ignore
        const get = () => parseJSON(args._scope.getVariable(varName))
        // @ts-ignore
            , set = (/** @type {Object|Array<*>} */ list) => args._scope.setVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };
    } else { // If the variable doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Scope)');
    }
}

/**
 * Grab a local variable and parse it into the appropriate data type.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {*} - The value of the variable.
 */
function getLocalVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseValue(value);
    } else { // If the variable is empty / doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a local variable and parse it into a JSON object/array.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {Object|Array<*>} - The parsed JSON object/array.
 */
function getLocalVarJSON(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        return parseJSON(value);
    } else { // If the variable is empty / doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Local)');
    }

}

/**
 * Grab a local variable and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): string}} - The parsed JSON object/array of the variable and a function for updating the variable.
 */
function getMutableLocalVar(varName) {
    const value = getLocalVariable(varName);

    if (value !== '') {
        const get = () => parseJSON(value);
        const set = (/** @type {Object|Array<*>} */ list) => setLocalVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };
    } else { // If the variable doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Local)');
    }
}

/**
 * Grab a global variable and parse it into the appropriate data type.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {*} - The value of the variable.
 */
function getGlobalVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseValue(value);
    } else { // If the variable is empty / doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a JSON object/array.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {Object|Array<*>} The parsed JSON object/array.
 */
function getGlobalVarJSON(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        return parseJSON(value);
    } else { // If the variable is empty / doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Global)');
    }
}

/**
 * Grab a global variable and parse it into a JSON object/array along with a function for updating the variable.
 *
 * @param {string} varName - The name of the variable to get.
 * @returns {{list: Object|Array<*>, setList: function(Object|Array<*>): string}} The parsed JSON object/array and a function for updating the variable.
 */
function getMutableGlobalVar(varName) {
    const value = getGlobalVariable(varName);

    if (value !== '') {
        const get = () => parseJSON(value)
            , set = (/** @type {Object|Array<*>} */ list) => setGlobalVariable(varName, JSON.stringify(list));

        return { list: get(), setList: set };
    } else { // If the variable doesn't exist, throw an error
        throw new TypeError('No such variable: ' + varName + '(Global)');
    }
}

// SHORTHAND PARSING

/**
 * Parse a value or variable into a value. If the target is a variable name, it will be resolved to its value.
 *
 * @param {*} target - The target variable or value to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {*} - The parsed value.
 */
export function parseValueOrVar(target, args) {
    // Check if the target is a variable name
    const [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

    if (!varName) { // If it isn't, try to parse it as a value and create an empty mutation function
        return parseValue(target);
    } else if (!prefix) { // If it is a variable name, check if it has a prefix
        return getScopeVar(varName, args);
    } else { // If it does, check if it's a local or global variable
        return prefix === '.'
            ? getLocalVar(varName)
            : getGlobalVar(varName);
    }
}

/**
 * Parse a JSON string or variable into a JSON object/array. If the target is a variable name, it will be resolved to its value.
 *
 * @param {*} target - The target variable or value to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {Object|Array<*>} - The parsed JSON object/array
 */
export function parseJSONOrVar(target, args) {
    // Check if the target is a variable name
    const [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

    if (!varName) { // If it isn't, try to parse it as JSON and create an empty mutation function
        return parseJSON(target);
    } else if (!prefix) { // If it is a variable name, check if it has a prefix
        return getScopeVarJSON(varName, args);
    } else { // If it does, check if it's a local or global variable
        return prefix === '.'
            ? getLocalVarJSON(varName)
            : getGlobalVarJSON(varName);
    }
}

/**
 * Parse a value or variable into a value. If the target is a variable name, it will be resolved to its value.
 * Allows mutability of the variable.
 *
 * @param {*} target - The target variable or value to parse.
 * @param {Object} args - Slash commands arguments.
 * @returns {{list: Object|Array<*>, setList: (function(Object|Array<*>): string)}} - The parsed JSON object/array and a function to update the variable.
 */
export function mutableParseValueOrVar(target, args) {
    // Check if the target is a variable name
    const [, prefix, varName] = target.match(/^([.$])?([-_a-zA-Z]+)$/);

    if (!varName) { // If it isn't, try to parse it as JSON and create an empty mutation function
        const get = () => parseJSON(target)
            , set = () => {};

        // @ts-ignore
        return { list: get(), setList: set };
    } else if (!prefix) { // If it is a variable name, check if it has a prefix
        return getMutableScopeVar(varName, args);
    } else { // If it does, check if it's a local or global variable
        return prefix === '.'
            ? getMutableLocalVar(varName)
            : getMutableGlobalVar(varName);
    }
}
