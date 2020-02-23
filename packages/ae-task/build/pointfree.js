"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "compose", {
  enumerable: true,
  get: function get() {
    return _utils.compose;
  }
});
exports.toPromise = exports.mapRejected = exports.fold = exports.fork = exports.bimap = exports.map = void 0;

var _utils = require("@algebraic-effects/utils");

var map = (0, _utils.pointfree)('map');
exports.map = map;
var bimap = (0, _utils.pointfree)('bimap');
exports.bimap = bimap;
var fork = (0, _utils.pointfree)('fork');
exports.fork = fork;
var fold = (0, _utils.pointfree)('fold');
exports.fold = fold;
var mapRejected = (0, _utils.pointfree)('mapRejected');
exports.mapRejected = mapRejected;
var toPromise = (0, _utils.pointfree)('toPromise')();
exports.toPromise = toPromise;