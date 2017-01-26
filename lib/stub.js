/**
 * Prevents calling original method and instead calls mock function if defined
 * intercepts how many times it was called and with what arguments
 * {Object} [object]
 * {String} [method]
 * {Function} [fn]
 **/
function stub(object, method, fn) {
    if (object && !method) {
        fn = object;
    }

    if (object && method && !object[method]) {
        throw new Error(`Object does not have method "${method}"`)
    }

    const isObjectVariant = object && method && object[method];

    let cachedMethod;
    if (isObjectVariant) {
        cachedMethod = object[method].bind(object);
    }

    const stubFn = function() {
        const args = Array.prototype.slice.call(arguments);

        stubFn.called++;
        stubFn.args.push(args);

        if (fn) {
            return fn.apply(undefined, args);
        }
        return undefined;
    };

    stubFn.reset = () => {
        stubFn.called = 0;
        stubFn.args = [];
    };

    stubFn.remove = () => {
        if (isObjectVariant) {
            object[method] = cachedMethod;
        }
    };

    stubFn.reset();

    if (isObjectVariant) {
        object[method] = stubFn;
    }

    return stubFn;
}

module.exports = stub;
