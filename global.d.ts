import getContext from '../../../st-context.js';
import libs from '../../../../lib.js';

declare global {
    var SillyTavern: {
        getContext(): typeof getContext;
        libs: typeof libs;
    }
}
