"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Action = require("./Action");
var assign = require("object-assign");

/**
 * ActionsFactory class
 */

var ActionsFactory =

/**
 * Constructs an ActionsFactory object and translates actions parameter into
 * Action objects.
 *
 * @param {object} actions - Object with methods to create actions with
 * @constructor
 */

function ActionsFactory(actions, dispatcher) {
  _classCallCheck(this, ActionsFactory);

  var _actions = {};
  var a;
  var action;
  for (a in actions) {
    if (actions.hasOwnProperty(a)) {
      action = new Action(actions[a], dispatcher);
      _actions[a] = action.callback.bind(action);
    }
  }
  assign(this, _actions);
};

module.exports = ActionsFactory;