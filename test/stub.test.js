const assert = require('assert');

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const stub = require('../lib/stub');

describe('Stub', () => {
    it('throws error when method does not exist in object', () => {
        const object = {};
        const method = 'prop';

        try {
            stub(object, method);
        } catch (err) {
            assert(err instanceof Error, 'Error thrown');
            assert(err.message === `Object does not have method "${method}"`);
        }
    });

    describe('#Stub without target function and without mock function', () => {
        it('returns stub function without target', () => {
            const methodStub = stub();

            const object = {
                method: methodStub
            };

            object.method();

            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [], '"method" function called without arguments');
        });

        it('returns stub function and intercepts call and arguments', () => {
            const methodStub = stub();

            const object = {
                method: methodStub
            };

            object.method(10, 'foo');

            assert.equal(methodStub.called, 1, '"method" function called once');
            const call1Args = methodStub.args[0];
            assert.deepEqual(call1Args, [10, 'foo'], 'arguments of "method" function intercepted by stub');
        });

        it('returns stub function and intercept calls and different arguments', () => {
            const methodStub = stub();
            const object = { method: methodStub };

            object.method(10, 'foo');
            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'foo'], 'arguments of "method" function intercepted by stub');

            object.method(20, 'bar');
            assert.equal(methodStub.called, 2, '"method" function called twice');
            assert.deepEqual(methodStub.args[1], [20, 'bar'], 'arguments of "method" function intercepted by stub');
        });
    });

    describe('#Stub without target function and with mock function', () => {
        it('returns stub function without target', () => {
            const mockFn = () => 'foo';
            const methodStub = stub(mockFn);

            const object = {
                method: methodStub
            };

            const result = object.method();

            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [], '"method" function called without arguments');
            assert.equal(result, 'foo', 'result is correct');
        });

        it('returns stub function and intercepts call and arguments', () => {
            const mockFn = (number, string) => `foo-${number}-${string}`;
            const methodStub = stub(mockFn);

            const object = {
                method: methodStub
            };

            const result = object.method(10, 'bar');

            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'bar'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'foo-10-bar', 'result is correct');
        });

        it('returns stub function and intercept calls and different arguments', () => {
            const mockFn = (number, string) => `foo-${number}-${string}`;
            const methodStub = stub(mockFn);

            const object = {
                method: methodStub
            };

            let result = object.method(10, 'bar');

            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'bar'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'foo-10-bar', 'result is correct');

            result = object.method(20, 'bar');
            assert.equal(methodStub.called, 2, '"method" function called twice');
            assert.deepEqual(methodStub.args[1], [20, 'bar'], 'arguments of "method" function intercepted by stub');
        });
    });

    describe('#Stub with target function in object and with mock function', () => {
        it('returns stub with method in object as a target', () => {
            const object = {
                method() {
                    return 'foo';
                }
            };
            const method = 'method';

            const mockFn = () => `mock`;
            const methodStub = stub(object, method, mockFn);

            const result = object.method();
            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [], '"method" function called without arguments');
            assert.equal(result, 'mock', 'result is correct');
        });

        it('returns stub and intercepts call and arguments', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const mockFn = (number, string) => `MOCK:${number} @@ ${string}`;
            const methodStub = stub(object, method, mockFn);

            const result = object.method(10, 'bar');
            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'bar'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'MOCK:10 @@ bar', 'result is correct');
        });

        it('returns stub and intercepts calls and different arguments', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const mockFn = (number, string) => `MOCK:${number} @@ ${string}`;
            const methodStub = stub(object, method, mockFn);

            let result = object.method(10, 'bar');
            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'bar'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'MOCK:10 @@ bar');

            result = object.method(20, 'qux');
            assert.equal(methodStub.called, 2, '"method" function called twice');
            assert.deepEqual(methodStub.args[1], [20, 'qux'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'MOCK:20 @@ qux');
        });

        it('returns stub, intercepts call and removes stub', () => {
            const object = {
                method(number, string) {
                    return `foo-${number}-${string}`;
                }
            };
            const method = 'method';

            const mockFn = (number, string) => `MOCK:${number} @@ ${string}`;
            const methodStub = stub(object, method, mockFn);

            let result = object.method(10, 'bar');
            assert.equal(methodStub.called, 1, '"method" function called once');
            assert.deepEqual(methodStub.args[0], [10, 'bar'], 'arguments of "method" function intercepted by stub');
            assert.equal(result, 'MOCK:10 @@ bar');

            methodStub.remove();

            result = object.method(20, 'qux');
            assert.equal(methodStub.called, 1, '"method" function called still only once');
            assert.deepEqual(methodStub.args[1], undefined, 'arguments of 2nd call of "method" not intercepted');
            assert.equal(result, 'foo-20-qux');
        });
    });
});
