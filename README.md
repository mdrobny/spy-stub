# Spy-stub

Simple **spy** and **stub** functions for testing purposes.

You need to mock or spy a function and sinon.js feels like an overkill?
Here are 2 stupidly simple helpers.

* No dependencies
* Node.js >= 4

# Install

```
$ npm install spy-stub
```

# Use

## spy(object, method)

```js
const { spy } = require('spy-stub');

const object = {
    snore(volume) {
        return `Snore with volume ${volume}`;
    };
};

it('should spy on a "snore" function', () => {
    const snoreSpy = spy(object, 'snore');

    const result = object.snore(5);

    assert.equal(snoreSpy.called, 1, 'Snore called once');
    const firstCallArgs = snoreSpy.args[0]; // "args" is list of arguments for each call
    const firstArgument = firstCallArgs[0];
    assert.equal(firstArgument, 5, 'Snore called with volume 5');
    assert.equal(result, 'Snore with volume 5', 'Result is correct');
});
```

## stub()
```js
const { stub } = require('spy-stub');

function functionToTest(number, snore) {
    if (number === 5) {
        return snore(number);
    }
};

it('should stub "snore" function', () => {
    const snoreStub = stub();

    functionToTest(5, snoreStub);

    assert.equal(snoreStub.called, 1, 'Snore called once');
    const firstCallArgs = snoreSpy.args[0];
    const firstArgument = firstCallArgs[0];
    assert.equal(firstArgument, 5, 'Snore called with volume 5');
});
```

## stub(mockFunction)
```js
const { stub } = require('spy-stub');

function functionToTest(number, snore) {
    return snore(number);
};

it('should stub "snore" function', () => {
    const snoreStub = stub(() => 'mock data');

    const result = functionToTest(5, snoreStub);

    assert.equal(snoreStub.called, 1, 'Snore called once');
    const firstCallArgs = snoreSpy.args[0];
    const firstArgument = firstCallArgs[0];
    assert.equal(firstArgument, 5, 'Snore called with volume 5');
    assert.equal(result, 'mock date', 'Result is mocked'); // <-- result is mocked
});
```

## stub(object, method, mockFunction)
```js
const { stub } = require('spy-stub');

it('should stub "snore" function', () => {
    const object = {
        snore(volume) {
            return `Snore with volume ${volume}`;
        };
    };
    const snoreStub = stub(object, 'snore', () => 'mock data');

    const result = object.snore(5);

    assert.equal(snoreStub.called, 1, 'Snore called once');
    const firstCallArgs = snoreSpy.args[0];
    const firstArgument = firstCallArgs[0];
    assert.equal(firstArgument, 5, 'Snore called with volume 5');
    assert.equal(result, 'mock date', 'Result is mocked'); // <-- result is mocked
});
```
