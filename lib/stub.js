function stub(fn) {
    const stubFn = () => {
        const args = Array.prototype.slice.call(arguments);

        stubFn.called++;
        stubFn.args.push(args);

        if (fn) {
            return fn(args);
        }
        return undefined;
    };

    stubFn.reset = () => {
        stubFn.called = 0;
        stubFn.args = [];
    };

    stubFn.reset();

    return stubFn;
}

module.exports = stub;
