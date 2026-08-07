import CoercionAndShorthand from './lib/coercion.js';
import MacroCoercionAndShorthand from './lib/coercion-macros.js';

import MacroHelpers from './lib/macro-helpers.js';

import StringOps from './lib/string-ops.js';

import ChatLogManipulation from './lib/chat-logs.js';

import KoboAPI from './lib/kobo-endpoint.js';

// eslint-disable-next-line no-undef
globalThis.NoxLib = {
    CoercionAndShorthand,
    MacroCoercionAndShorthand,

    MacroHelpers,

    StringOps,

    ChatLogManipulation,

    KoboAPI,
};

const
    data = await import('./manifest.json', { with: { type: 'json' } }),
    loadingOrder = data.default.loading_order;

console.log('[Nox-Lib] Library loaded | Load order: ' + loadingOrder);
