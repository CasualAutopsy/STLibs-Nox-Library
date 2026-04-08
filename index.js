const data = await import('./manifest.json', { with: { type: 'json' } })
    , loadingOrder = data.default.loading_order;

console.log('[Nox-Lib]Library loaded | Load order: ' + loadingOrder);
