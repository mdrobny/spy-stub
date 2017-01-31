/* eslint-disable prefer-rest-params */
/**
 * Calls original method but intercepts how many times it was called and with what arguments
 * {Object} [object]
 * {String} [method]
 **/
function spy(object, method) {
    if (object && !method) {
        throw new Error('Object passed but method is missing');
    }
    if (object && method && !object[method]) {
        throw new Error(`Object does not have method "${method}"`);
    }

    const isObjectVariant = object && method && object[method];

    let cachedMethod;
    if (isObjectVariant) {
        cachedMethod = object[method].bind(object);
    }

    function spyFn() {
        const args = Array.prototype.slice.call(arguments);
        spyFn.called++;
        spyFn.args.push(args);

        if (isObjectVariant) {
            return cachedMethod.apply(object, args);
        }
        return undefined;
    }

    spyFn.reset = () => {
        spyFn.called = 0;
        spyFn.args = [];
    };

    spyFn.remove = () => {
        if (isObjectVariant) {
            object[method] = cachedMethod;
        }
    };

    spyFn.reset();

    if (isObjectVariant) {
        object[method] = spyFn;
    }

    return spyFn;
}

module.exports = spy;
