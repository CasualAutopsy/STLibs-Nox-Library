// @ts-nocheck
import { SharedTxtTrans } from './string-ops.js';

/**
 * Documentation helper library.
 * @method `buildHelpString` - Build slash-command documentation.
 */
const DocHelper = (() => {
    const { trimIndents } = SharedTxtTrans;

    /**
     * Examples helper function for `buildHelpString`.
     *
     * @param {[code: String, comment: String][]} list
     * @returns {String}
     */
    function examples(list){
        const
            dom = document.createElement('div'),
            title = document.createElement('strong');

        title.textContent = 'Examples:';
        dom.append(title);

        const ul = document.createElement('ul');
        for (const [code, comment] of list) {
            const
                li = document.createElement('li'),
                pre = document.createElement('pre'),
                c = document.createElement('code');

            c.classList.add('language-stscript');
            c.textContent = trimIndents(code).trim();

            pre.append(c);
            li.append(pre);

            const comm = document.createElement('span');

            comm.innerHTML = comment;

            li.append(comm);
            ul.append(li);
        }

        dom.append(ul);

        return dom.outerHTML;
    }


    return {
        /**
         * Build slash-command documentation.
         *
         * @param {String} text
         * @param {[code: String, comment: String][]} ex
         * @returns {String}
         */
        buildHelpString(text, ex) {
            const converter = new showdown.Converter({
                emoji: true,
                literalMidWordUnderscores: true,
                parseImgDimensions: true,
                tables: true,
                underline: true,
                simpleLineBreaks: false,
                strikethrough: true,
                disableForced4SpacesIndentedSublists: true,
            });
            return [
                text ? converter.makeHtml(trimIndents(text)) : '# HELP MISSING',
                ex ? examples(ex) : '# EXAMPLES MISSING',
            ].filter(it=>it).join('\n\n');
        },
    };
})();

/**
 * The Slash Command Helpers catagorey.
 * Contains all the library functions revolved around slash command helpers.
 *
 * @prop `Documentation` - Documentation helper library.
 */
const SlashCMDHelpers = {
    Documentation: DocHelper,
};

export { SlashCMDHelpers };
