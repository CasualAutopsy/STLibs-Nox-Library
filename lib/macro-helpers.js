// @ts-nocheck

/**
 * Conditionals helper library.
 *
 * @method `splitOnTopLevelElse` - Split macro content on a conditional top-level else.
 */
const CondHelpers = (() => {
    const { macros } = SillyTavern.getContext();

    return {
        /**
         * Split macro content on a conditional top-level else.
         *
         * @param {String} content - The macro content to split.
         * @param {String[]} condTypes - The conditional macro types to split on.
         * @returns {{ thenBranch: String, elseBranch: String|undefined }} The macro content split into then/else branches.
         */
        splitOnTopLevelElse(content, condTypes) {
            const { cst } = macros.parser.parseDocument(content);
            const macroNodes = /** @type {import('chevrotain').CstNode[]} */ (cst?.children?.macro || []);

            let depth = 0;
            for (const macroNode of macroNodes) {
                const info = macros.cstWalker.extractMacroInfo(macroNode);
                if (!info) continue;

                // Only track scoped {{if}} blocks (1 arg = condition only, expects {{/if}})
                // Inline {{if condition::content}} has 2 args and doesn't affect depth
                if (condTypes.includes(info.name) && !info.isClosing && (info.argCount === 3 || info.argCount === 2)) {
                    depth++;
                } else if (condTypes.includes(info.name) && info.isClosing) {
                    depth--;
                } else if (info.name === 'else' && depth === 0) {
                    return {
                        thenBranch: content.slice(0, info.startOffset),
                        elseBranch: content.slice(info.endOffset + 1),
                    };
                }
            }

            return { thenBranch: content, elseBranch: undefined };
        },
    };
})();

const MacroHelpers = {
    Conditionals: CondHelpers,
};

export { MacroHelpers };
