'use strict';

var builder = require('./lib/builder');

module.exports = {

    create: builder.create.bind(builder),

    initDefaults: builder.initDefaults.bind(builder)
};
