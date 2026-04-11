export function macroParseVar(target, resolve) {
    let varArg = resolve(target);

    const shorthandMatch = varArg.match(/^([.$])?([-_a-zA-Z]+)$/);
    if (shorthandMatch) {
        const [, prefix, varName] = shorthandMatch
            , varMacro = prefix === '.'
                ? 'getvar'
                : 'getglobalvar';

        varArg = resolve(`{{${varMacro}::${varName}}}`);
    }

    return [varArg, shorthandMatch];
}

export function macroMutateVar(value, resolve, shorthand) {
    const [, prefix, varName] = shorthand;

    const varMacro = prefix === '.'
        ? 'setvar'
        : 'setglobalvar';

    value = typeof value == 'object' ? JSON.stringify(value) : String(value);
    resolve(`{{${varMacro}::${varName}::${value}}}`);
}
