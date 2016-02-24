'use strict';

var _ = require('underscore'),
    moment = require('moment');

var builder = {

    /**
     * Object creation
     * @param  {Object} schema - the schema
     * @param  {Object} prototype - the objects prototype
     * @return {Object}
     */
    create: function (schema, prototype) {

        var vals = {}, //internal properties
            obj = {};

        if (!prototype) prototype = {};

        for (var key in schema) {

            if (schema.hasOwnProperty(key)) {

                vals[key] = null;
                obj[key] = this.define(schema, vals, key);
            }
        }

        return Object.create(prototype, obj);
    },

    /**
     * Create property definition
     * @param  {Object} schema - the schema
     * @param  {Object} vals - the internal property values object
     * @param  {String} key - the property name
     * @return {Object} - the property definition
     */
    define: function (schema, vals, key) {
        /*jshint maxcomplexity:8 */
        switch (schema[key]) {
        case String:
            return this._(vals, key, this._string);
        case Number:
            return this._(vals, key, this._number);
        case Array:
            return this._(vals, key, this._array);
        case Object:
            return this._(vals, key, this._object);
        case Boolean:
            return this._(vals, key, this._boolean);
        case Date:
            return this._(vals, key, this._date);
        default:
            return this._(vals, key, this._undefined);
        }
    },

    /**
     * Initialise object default values based on schema
     * @param  {Object} obj - the object
     * @param  {Object} schema - the schema
     * @return {Object}
     */
    initDefaults: function (obj, schema) {

        for (var key in schema) {

            if (schema.hasOwnProperty(key) && obj.hasOwnProperty(key)) {

                var type = schema[key],
                    ignore = new RegExp(/date/ig);

                if (typeof type === 'function' && !ignore.test(type.prototype.constructor.name)) {

                        obj[key] = schema[key].call(null);
                } 
            }
        }

        return obj;
    },

    /**
     * Assemble the definition object and set approiate set for type
     * @param  {Object} vals - the internal property values object
     * @param  {String} key - the property name
     * @param  {Function} setter - the setter function
     */
    _: function (vals, key, setter) {
        return {
            enumerable: true,
            get: function () {
                return vals[key];
            },
            set: function (val) {
                vals[key] = setter(val);
            }
        };
    },

    /**
     * String setter
     * @param  {Object|Array|String|Number|Boolean} val - the value
     * @return {String}
     */
    _string: function (val) {

        if (val !== null) return String.call(null, val);
        return null;
    },

    /**
     * Number setter
     * @param  {Object|Array|String|Number|Boolean} val - the value
     * @return {Number}
     */
    _number: function (val) {

        if (val !== null) return Number.call(null, val);
        return null;
    },

    /**
     * Array setter
     * @param  {Object|Array|String|Number|Boolean} val - the value
     * @return {Array}
     */
    _array: function (val) {

        if (!_.isArray(val) && val !== null) return [val];
        return val;
    },

    /**
     * Object setter
     * @param  {Object|Array|String|Number|Boolean} val - the value
     * @return {Object}
     */
    _object: function (val) {

        if (_.isArray(val) && val.length === 1 && _.isObject(val[0])) return val[0];

        if (!_.isArray(val) && _.isObject(val)) return val;

        return {};
    },

    /**
     * Boolean setter
     * @param  {Object|Array|String|Number|Boolean} val - the value
     * @return {Boolean}
     */
    _boolean: function (val) {

        if (_.isNumber(val)) return Boolean.call(null, val);

        if (_.isString(val)) {

            if (val.match(/true|false/ig)) return JSON.parse(val);
            if (val.match(/yes/ig)) return true;
            if (val.match(/no/ig)) return false;
        }

        if (_.isBoolean(val)) return val;

        return val !== null;
    },

    /**
     * Date setter
     * @param  {Object|Array|String|Number|Boolean|Date} val - the value
     * @return {Date}
     */
    _date: function (val) {
        /*jshint maxcomplexity:8 */

        if (_.isArray(val) && val.length === 1 && _.isDate(val[0])) val = val[0];

        //if (_.isDate(val)) return val;

        if (_.isArray(val) && val.length === 1 && _.isString(val[0])) val = val[0];

        if (_.isString(val) || _.isNumber(val)) {

            var date = moment(new Date(val));
            if (date.isValid()) return date.toDate();

            date = moment(new Date(val.split('/').reverse().join('/')));
            if (date.isValid()) return date.toDate();

            date = moment(new Date(Number(val)));
            if (date.isValid()) return date.toDate();

        }

        return val;
    },

    /**
     * Set anything
     * @param  {Object|Array|String|Number|Boolean|Date} val - the value
     * @return {Object|Array|String|Number|Boolean|Date
     */
    _undefined: function (val) {

        return val;
    }
};

module.exports = builder;
