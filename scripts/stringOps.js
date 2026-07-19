// @ts-nocheck
/**
 * Convert a regex string to a RegExp class
 *
 * @param {String} re_string - the regex string
 * @returns {RegExp} - the RegExp
 */
export function toRegExp(re_string) {
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
}
