"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Action class
 */

var Action =

/**
 * Constructs an Action object
 *
 * @param {function} callback - Callback method for Action
 * @constructor
 */
function Action(callback, dispatcher) {
  _classCallCheck(this, Action);

  this.callback = callback;
  this.dispatch = dispatcher.dispatch.bind(dispatcher);
};

module.exports = Action;