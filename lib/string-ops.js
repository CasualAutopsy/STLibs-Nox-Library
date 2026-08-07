// @ts-nocheck

/**
 * Sharable text transformation functions that can be reused as helper functions.
 * @method `trimIndents` - Trim indents from a string.
 */
const SharedTxtTrans = (() => {
    return {
        /**
         * Trim indents from a string.
         *
         * @param {String} txt - The text to trim indents from.
         * @returns {String} String with indents removed.
         */
        trimIndents(txt){
            if (txt.split('\n').length < 2) return txt;

            const indent = /^([\t ]*)\S/m.exec(txt)?.[1] ?? '';
            const re = new RegExp(`^${indent}`, 'mg');

            return txt.replace(re, '').replace(/\s*$/s, '');
        },
    };
})();

/**
 * Text transformation library.
 * @method `trimIndents` - Trim indents from a string.
 */
const TextTransformation = (() => {
    return {
        ...SharedTxtTrans
    };
})();

/**
 * RegEx helper library.
 * @method `RegExHelper` - Convert a regex string to a RegExp class.
 */
const RegExHelper = (() => {
    return {
        /**
         * Convert a regex string to a RegExp class.
         *
         * @param {String} re_string - the regex string.
         * @returns {RegExp} The RegExp.
         */
        toRegExp(re_string) {
            // Credit to the man, the myth, the legend: Lenny
            // and his amazing extension LALib
            return new RegExp(
                re_string
                    .replace(/^\/(.+)\/([a-z]*)$/, '$1')
                ,
                re_string
                    .replace(/^\/(.+)\/([a-z]*)$/, '$2')
                ,
            );
        },
    };
})();

/**
 * The StringOps catagorey.
 * Contains all the library functions revolved around string manipulation.
 *
 * @prop `TextTransformation` - Text transformation library.
 * @prop `RegExHelper` - RegEx helper library.
 */
const StringOps = {
    TextTransformation,
    RegExHelper,
}

export default StringOps;
export { SharedTxtTrans };
