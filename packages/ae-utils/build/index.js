"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant = exports.identity = exports.flatten = exports.isArray = exports.compose = exports.pointfree = exports.isGenerator = exports.createSymbol = exports.createSymbolObject = void 0;
var symbolObjectPool = {};

var createSymbolObject = function createSymbolObject(name) {
  if (symbolObjectPool[name]) return symbolObjectPool[name];
  symbolObjectPool[name] = {
    name: name
  };
  return symbolObjectPool[name];
};

exports.createSymbolObject = createSymbolObject;

var createSymbol = function createSymbol(key) {
  return typeof Symbol === 'function' ? Symbol.for(key) : createSymbolObject(key);
};

exports.createSymbol = createSymbol;

var isGenerator = function isGenerator(p) {
  return p && p.constructor && (p.constructor.name + '').indexOf('GeneratorFunction') !== -1;
};

exports.isGenerator = isGenerator;

var pointfree = function pointfree(methodName) {
  return function () {
    var _arguments = arguments;
    return function (x) {
      return x[methodName].apply(x, _arguments);
    };
  };
};

exports.pointfree = pointfree;

var compose = function compose() {
  return [].slice.apply(arguments).reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
};

exports.compose = compose;

var isArray = Array.isArray || function (a) {
  return {}.toString.call(a) == '[object Array]';
};

exports.isArray = isArray;

var flatten = function flatten(arr) {
  return arr.reduce(function (list, item) {
    return list.concat(isArray(item) ? item : [item]);
  }, []);
};

exports.flatten = flatten;

var identity = function identity(x) {
  return x;
};

exports.identity = identity;

var constant = function constant(x) {
  return function () {
    return x;
  };
};

exports.constant = constant;