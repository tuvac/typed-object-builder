# typed-object-builder

Typed object builder library attempts to coerce values to types. Useful when using XML or other string de-serialization utilities.

## Getting Started
Install the module with: `npm install typed-object-builder`

## Documentation
This library attempts to coerce values into the correct data type using some basic rules.
It was primarily created for use alongside libraries such as xml2js and various CSV and XLSX reading libraries which tend to lose types during de-serialization.


## Examples
```javascript

var objBuilder = require('typed-object-builder');

//Create object schema
var schema = {
    'testOne': String,
    'testTwo': Number,
    'testThree': Array,
    'testFour': Object,
    'testFive': Boolean,
    'testSix': Date,
    'testSeven': undefined //any value, no coercion will take place
};

var prototype = {
    //... methods go here
};

var myObject = objBuilder.create(schema, prototype);

myObject.testOne = 1;    // will be '1'
myObject.testTwo = '1'   // will be 1
myObject.testThree = 1;  // will be [1]

//... and so on, check unit tests for demo of coercion rules

```

## License
Copyright (c) 2016 Stuart Williams  
