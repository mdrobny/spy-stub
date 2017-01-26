const assert = require('assert');

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const spy = require('../lib/spy');

describe('Spy', () => {
    it('throws error when object passed but method undefined', () => {
        const object = {};

        try {
            spy(object);
        } catch (err) {
            assert(err instanceof Error, 'Error thrown');
            assert(err.message === 'Object passed but method is missing');
        }
    });

    it('throws error when method does not exist in object', () => {
        const object = {};
        const method = 'prop';

        try {
            spy(object, method);
        } catch (err) {
            assert(err instanceof Error, 'Error thrown');
            assert(err.message === `Object does not have method "${method}"`);
        }
    });

    describe('#Spy without target function', () => {
        it('returns spy function without target', () => {
            const methodSpy = spy();

            const object = {
                method: methodSpy
            };

            object.method();

            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [], '"method" function called without arguments');
        });

        it('returns spy function and intercepts call and arguments', () => {
            const methodSpy = spy();

            const object = {
                method: methodSpy
            };

            object.method(10, 'foo');

            assert.equal(methodSpy.called, 1, '"method" function called once');
            const call1Args = methodSpy.args[0];
            assert.deepEqual(call1Args, [10, 'foo'], 'arguments of "method" function intercepted by spy');
        });

        it('returns spy function and intercept calls and different arguments', () => {
            const methodSpy = spy();
            const object = { method: methodSpy };

            object.method(10, 'foo');
            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [10, 'foo'], 'arguments of "method" function intercepted by spy');

            object.method(20, 'bar');
            assert.equal(methodSpy.called, 2, '"method" function called twice');
            assert.deepEqual(methodSpy.args[1], [20, 'bar'], 'arguments of "method" function intercepted by spy');
        });
    });

    describe('#Spy on function in object', () => {
        it('returns spy with method in object as a target', () => {
            const object = {
                method() {
                    return 'foo';
                }
            };
            const method = 'method';

            const methodSpy = spy(object, method);

            const result = object.method();
            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [], '"method" function called without arguments');
            assert.equal(result, 'foo', 'result is correct');
        });

        it('returns spy and intercepts call and arguments', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const methodSpy = spy(object, method);

            const result = object.method(10, 'bar');
            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [10, 'bar'], 'arguments of "method" function intercepted by spy');
            assert.equal(result, 'foo-10-bar', 'result is correct');
        });

        it('returns spy and intercepts calls and different arguments', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const methodSpy = spy(object, method);

            let result = object.method(10, 'bar');
            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [10, 'bar'], 'arguments of "method" function intercepted by spy');
            assert.equal(result, 'foo-10-bar');

            result = object.method(20, 'qux');
            assert.equal(methodSpy.called, 2, '"method" function called twice');
            assert.deepEqual(methodSpy.args[1], [20, 'qux'], 'arguments of "method" function intercepted by spy');
            assert.equal(result, 'foo-20-qux');
        });

        it('returns spy, intercepts call and removes spy', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const methodSpy = spy(object, method);

            let result = object.method(10, 'bar');
            assert.equal(methodSpy.called, 1, '"method" function called once');
            assert.deepEqual(methodSpy.args[0], [10, 'bar'], 'arguments of "method" function intercepted by spy');
            assert.equal(result, 'foo-10-bar');

            methodSpy.remove();

            result = object.method(20, 'qux');
            assert.equal(methodSpy.called, 1, '"method" function called still only once');
            assert.deepEqual(methodSpy.args[1], undefined, 'arguments of 2nd call of "method" not intercepted');
            assert.equal(result, 'foo-20-qux');
        });
    });
});
