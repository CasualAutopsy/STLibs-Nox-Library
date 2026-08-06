/**
 * @typedef {{name: String, argsBeforeScope: Number}} CondDict - Conditional macro dictionary.
 * @typedef {[name: String, argsBeforeScope: Number][]} CondTuple - Conditional macro tuple.
 *
 * @typedef {{thenBranch: String, elseBranch: String|undefined}} CondBranches - Then / Else branches used by conditional macros.
 */


/**
 * Conditionals helper library.
 *
 * @method `splitOnTopLevelElse` - Split macro content on a conditional top-level else.
 */
const CondHelpers = (() => {
    const { macros } = SillyTavern.getContext();

    class ConditionalMacros {
        /**
         * Initial conditional macro names.
         *
         * @param {CondDict[]} macroList - List of conditional macro names to initialize with.
         */
        constructor(macroList = [{name: 'if', argsBeforeScope: 1}]) {
            this.macros = macroList;
        }

        // UPDATE LIST

        /**
         * Add a new conditional macro.
         *
         * @param {CondDict} macroDict - The conditional macro to add.
         */
        addMacro(macroDict) {
            this.macros.push(macroDict);
        }

        /**
         * Add a batch of conditional macros.
         *
         * @param {CondTuple} macroList - List of conditional macro names to add.
         */
        addMacroBatch(macroList) {
            macroList.map((macro) => {
                this.addMacro({name: macro[0], argsBeforeScope: macro[1]})
            });
        }

        /**
         * Remove a conditional macro.
         *
         * @param {String} macroName - The conditional macro to remove.
         */
        removeMacro(macroName) {
            const index = this.macros.map((macro) => macro.name).indexOf(macroName);

            if (index !== -1) {
                this.macros.splice(index, 1);
            }
        }

        /**
         * Remove a batch of conditional macros.
         *
         * @param {String[]} macroList - List of conditional macro names to remove.
         */
        removeMacroBatch(macroList) {
            this.macros = this.macros.filter((macro) => !macroList.includes(macro.name));
        }

        // FILTER LIST

        /**
         * Retrieve the list of registered macro names.
         *
         * @returns {String[]} The list of registered macro names.
         */
        getNameList() {
            return this.macros.map((macro) => macro.name);
        }

        /**
         * Convert the registered macros into a tuple.
         *
         * @returns {CondTuple} The registered macros as a tuple.
         */
        getMacroTuple() {
            return this.macros.map((macro) => [macro.name, macro.argsBeforeScope]);
        }

        /**
         * Get a filtered list of conditional macro names.
         *
         * @param {String} subString - The substring to filter by.
         * @param {"in"|"nin"} filter - The filter type. ('in' = includes, 'nin' = not includes)
         *
         * @returns {CondTuple} The filtered list of conditional macro names.
         */
        getFilteredTuple(subString, filter = 'in') {
            return this.macros.filter((macro) => {
                switch (filter) {
                    case 'in':
                        return macro.name.includes(subString);
                    case 'nin':
                        return !macro.name.includes(subString);
                    default:
                        return false;
                }
            }).map((macro) => [macro.name, macro.argsBeforeScope]);
        }

        // MACRO METHODS

        /**
         * Split macro content on a conditional top-level else.
         *
         * @param {String} content - The macro content to split.
         * @param {CondTuple|null} condTypes - The conditional macro tuple containing macro info.
         *
         * @returns {CondBranches} The macro content split into then/else branches.
         */
        splitOnTopLevelElse(content, condTypes = null) {
            const { cst } = macros.parser.parseDocument(content);
            const macroNodes = /** @type {import('chevrotain').CstNode[]} */ (cst?.children?.macro || []);

            if (condTypes == null) {
                condTypes = this.getMacroTuple();
            }

            let depth = 0;
            for (const macroNode of macroNodes) {
                const info = macros.cstWalker.extractMacroInfo(macroNode);
                if (!info) continue;

                const cond_cur = condTypes.find((tup) => {
                    return tup[0] === info.name;
                });

                if (cond_cur && !info.isClosing && (info.argCount === cond_cur[1])) {
                    depth++;
                } else if (cond_cur && info.isClosing) {
                    depth--;
                } else if (info.name === 'else' && depth === 0) {
                    return {
                        thenBranch: content.slice(0, info.startOffset),
                        elseBranch: content.slice(info.endOffset + 1),
                    };
                }
            }

            return { thenBranch: content, elseBranch: undefined };
        }
    }





    return {
        /**
         * Global conditional macro list. Used to share accross all ST extensions.
         */
        GlobalCondMacroList: new ConditionalMacros(),

        /**
         * Conditional macro class. Used to create a new conditional macro list in the scope of a specific extension.
         *
         * @param {String[]} macroList - List of conditional macro names to initialize with. (Default: `['if']`)
         */
        DevScopeCondMacroClass: ConditionalMacros,
    };
})();

const ErrorHelpers = (() => {
    const { macros } = SillyTavern.getContext();

    class MacroErrorSystem {
        constructor() {
            /** @type {{[x: String]: [marker: String, template: String]}} */
            this.error_types = {
                "error": [
                    'ERROR',
                    '[NoxLib]|[%LOC%] Error: %MESSAGE%',
                ],
                "type_error": [
                    'TYPE_ERROR',
                    '[NoxLib]|[%LOC%] TypeError: Expected %EXPECTED%. Got %TYPE% instead.\n%MESSAGE%',
                ],
            };
        }

        /**
         *
         * @param {String} errorName
         * @param {String} errorMarker
         * @param {String} errorTemplate
         */
        addErrorType(errorName, errorMarker, errorTemplate) {
            this.error_types[errorName] = [errorMarker, errorTemplate];
        }

        /**
         *
         * @param {String} content
         *
         * @returns {String}
         */
        topLevelCatch(content) {
            const { cst } = macros.parser.parseDocument(content);
            const macroNodes = /** @type {import('chevrotain').CstNode[]} */ (cst?.children?.macro || []);

            let depth = 0;
            for (const macroNode of macroNodes) {
                const info = macros.cstWalker.extractMacroInfo(macroNode);
                if (!info) continue;

                if (info.name === 'tryResolve' && !info.isClosing) {
                    depth++;
                } else if (info.name === 'tryResolve' && info.isClosing) {
                    depth--;
                } else if (info.name === 'catch' && depth === 0) {
                    return content.slice(info.endOffset + 1);
                }
            }

            return '';
        }


        /**
         *
         * @param {*} errorName
         * @param {*} message
         * @param {*} templateArgs
         */
        throwError(errorType, message, templateArgs = {}) {
            const getErrorType = this.error_types[errorType];


        }


    }
})();

const MacroHelpers = {
    Conditionals: CondHelpers,
};

export { MacroHelpers };
