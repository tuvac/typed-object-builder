'use strict';

var assert = require('assert'),
    builder = require('../lib/builder');

describe('Builder', function () {

    var schema, test;

    beforeEach(function() {

        schema = {
            'testOne': String,
            'testTwo': Number,
            'testThree': Array,
            'testFour': Object,
            'testFive': Boolean,
            'testSix': Date,
            'testSeven': undefined
        };

        test = builder.create(schema);
    });


    describe('#create', function () {

        it('Should cast values to a string', function () {

            test.testOne = '';
            assert.strictEqual(test.testOne, '');

            test.testOne = '1';
            assert.strictEqual(test.testOne, '1');

            test.testOne = 1;
            assert.strictEqual(test.testOne, '1');

            test.testOne = ['1'];
            assert.strictEqual(test.testOne, '1');

            test.testOne = false;
            assert.strictEqual(test.testOne, 'false');

            test.testOne = true;
            assert.strictEqual(test.testOne, 'true');

            test.testOne = null;
            assert.strictEqual(test.testOne, null);

        });

        it('Should cast values to a number', function () {

            test.testTwo = 1;
            assert.strictEqual(test.testTwo, 1);

            test.testTwo = '1';
            assert.strictEqual(test.testTwo, 1);

            test.testTwo = [1];
            assert.strictEqual(test.testTwo, 1);

            test.testTwo = false;
            assert.strictEqual(test.testTwo, 0);

            test.testTwo = true;
            assert.strictEqual(test.testTwo, 1);

            test.testTwo = null;
            assert.strictEqual(test.testTwo, null);
        });

        it('Should cast values to an array', function () {

            test.testThree = 1;
            assert.deepEqual(test.testThree, [1], 'number to array');

            test.testThree = '1';
            assert.deepEqual(test.testThree, ['1'], 'string to array');

            test.testThree = [1];
            assert.deepEqual(test.testThree, [1], 'array to array');

            test.testThree = {
                '1': 1
            };
            assert.deepEqual(test.testThree, [{
                '1': 1
            }], 'object to array');

            test.testThree = false;
            assert.deepEqual(test.testThree, [false]);

            test.testThree = null;
            assert.strictEqual(test.testThree, null);

        });

        it('Should cast values to an object', function () {

            test.testFour = 1;
            assert.deepEqual(test.testFour, {}, 'number to object');

            test.testFour = '1';
            assert.deepEqual(test.testFour, {}, 'string to object');

            test.testFour = [1];
            assert.deepEqual(test.testFour, {}, 'simple array to object');

            test.testFour = [{
                '1': 1
            }];
            assert.deepEqual(test.testFour, {
                '1': 1
            }, 'object wrapped in an array to object');

            test.testFour = {
                '1': 1
            };
            assert.deepEqual(test.testFour, {
                '1': 1
            }, 'object to object');

            test.testFour = false;
            assert.deepEqual(test.testFour, {}, 'boolean to object');
        });

        it('Should cast values to a boolean', function () {

            test.testFive = 0;
            assert.strictEqual(test.testFive, false, '1');

            test.testFive = 1;
            assert.strictEqual(test.testFive, true, '2');

            test.testFive = 'false';
            assert.strictEqual(test.testFive, false, '3');

            test.testFive = 'true';
            assert.strictEqual(test.testFive, true, '4');

            test.testFive = 'NO';
            assert.strictEqual(test.testFive, false, '5');

            test.testFive = 'YES';
            assert.strictEqual(test.testFive, true, '6');

            test.testFive = 'no';
            assert.strictEqual(test.testFive, false, '7');

            test.testFive = 'yes';
            assert.strictEqual(test.testFive, true, '8');

            test.testFive = {
                1: 1
            };
            assert.strictEqual(test.testFive, true, 'object to boolean');

            test.testFive = null;
            assert.strictEqual(test.testFive, false, 'null to boolean');
        });

        it('Should cast value to a date', function () {

            test.testSix = 1456311310000;
            assert.equal(test.testSix.toString(), 'Wed Feb 24 2016 10:55:10 GMT+0000 (GMT)');

            test.testSix = '1456311310000';
            assert.strictEqual(test.testSix.toString(), 'Wed Feb 24 2016 10:55:10 GMT+0000 (GMT)');

            test.testSix = '12/31/2016';
            assert.equal(test.testSix.toString(), 'Sat Dec 31 2016 00:00:00 GMT+0000 (GMT)');

            test.testSix = '31/12/2016';
            assert.strictEqual(test.testSix.toString(), 'Sat Dec 31 2016 00:00:00 GMT+0000 (GMT)');

            test.testSix = '2014-12-31 23:59:59 +0000';
            assert.strictEqual(test.testSix.toString(), 'Wed Dec 31 2014 23:59:59 GMT+0000 (GMT)');

            test.testSix = ['31/12/2016'];
            assert.strictEqual(test.testSix.toString(), 'Sat Dec 31 2016 00:00:00 GMT+0000 (GMT)');

            test.testSix = new Date(1456311310000);
            assert.equal(test.testSix.toString(), 'Wed Feb 24 2016 10:55:10 GMT+0000 (GMT)');

            test.testSix = 'not a date';
            assert.strictEqual(test.testSix, 'not a date');

        });

        it('Should allow any value', function () {

            test.testSeven = 1;
            assert.strictEqual(test.testSeven, 1);

            test.testSeven = '1';
            assert.strictEqual(test.testSeven, '1');

            test.testSeven = [1];
            assert.deepEqual(test.testSeven, [1]);

            test.testSeven = {
                1: '1'
            };
            assert.deepEqual(test.testSeven, {
                1: '1'
            });
        });

    });

    describe('#initDefaults', function () {

        it('Should initialise some default values based on schema', function () {

            builder.initDefaults(test, schema);

            assert.strictEqual(test.testOne, '');
            assert.strictEqual(test.testTwo, 0);
            assert.deepEqual(test.testThree, []);
            assert.deepEqual(test.testFour, {});
            assert.deepEqual(test.testFive, false);
            assert.strictEqual(test.testSix, null);
        });
    });
});
