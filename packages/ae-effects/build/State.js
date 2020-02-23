"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@algebraic-effects/core");

var State = (0, _core.createEffect)('State', {
  get: (0, _core.func)([], 'a'),
  set: (0, _core.func)(['a']),
  update: (0, _core.func)(['a -> a'], 'a')
});

State.of = function (initState) {
  var CustomState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : State;
  var current = initState;
  return CustomState.handler({
    get: function get(o) {
      return function () {
        return o.resume(current);
      };
    },
    set: function set(o) {
      return function (x) {
        return o.resume(current = x);
      };
    },
    update: function update(o) {
      return function (fn) {
        return o.resume(current = fn(current));
      };
    }
  });
};

var _default = State;
exports.default = _default;