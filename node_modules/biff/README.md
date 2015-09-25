#Biff
Flux Architecture Made Easy

*What is Biff?*

When writing ReactJS apps, it is enormously helpful to use Facebook's Flux architecture. It truly complements ReactJS' unidirectional data flow model. Facebook's Flux library provides a Dispatcher, and some examples of how to write Actions and Stores. However, there are no helpers for Action & Store creation, and Stores require 3rd part eventing.

Biff is a library that provides all 3 components of Flux architecture, using Facebook's Dispatcher, and providing factories for Actions & Stores.

###Demo

Check out this JSFiddle Demo to see how Biff can work for you:

[http://jsfiddle.net/2xtqx3u3/](http://jsfiddle.net/2xtqx3u3/)

###Getting Started

The first step to using Biff is to create a new instance of Biff.

####Standalone

```javascript
var biff = new Biff();
```

####Modular
```javascript
var Biff = require('biff');
module.exports = new Biff();
```

Each instance of Biff has its own Dispatcher instance created and attached.

In fact, all created Actions & Stores are also stored on the Biff object as `actions` and `stores` respectively.

```javascript
biff.dispatcher // Dispatcher instance
biff.actions // Array of actions
biff.stores // Array of stores
```

###Stores

Biff has a **createStore** helper method that creates an instance of a Store. Store instances have been merged with EventEmitter and come with **emitChange**, **addChangeListener** and **removeChangeListener** methods built in.

When a store is created, its methods parameter specified what public methods should be added to the Store object. Every store is automatically registered with the Dispatcher and the `dispatcherID` is stored on the Store object itself, for use in `waitFor` methods.

Creating a store with Biff looks like this:

```javascript
// Require the Biff instance you created
var biff = require('./biff');

// Internal data object
var _todos = [];

function addTodo(text) {
  _todos.push(text);
}

var TodoStore = biff.createStore({

getTodos: function() {
  return _todos;
}

}, function(payload){

  switch(payload.actionType) {
  case 'ADD_TODO':
    addTodo(payload.text);
    this.emitChange();
  break;
  default:
    return true;
  }

  return true;

});
```

Use `Dispatcher.waitFor` if you need to ensure handlers from other stores run first.

```javascript
var biff = require('./biff');
var Dispatcher = Biff.dispatcher;
var OtherStore = require('../stores/OtherStore');

var _todos = [];

function addTodo(text, someValue) {
  _todos.push({ text: text, someValue: someValue });
}

 ...

    case 'ADD_TODO':
      Dispatcher.waitFor([OtherStore.dispatcherID]);
      var someValue = OtherStore.getSomeValue();
      addTodo(payload.text, someValue);
      break;

 ...
```

Stores are also created a with a ReactJS component mixin that adds and removes store listeners that call an **storeDidChange** component method.

Adding Store eventing to your component is as easy as:

```javascript
var TodoStore = require('../stores/TodoStore');

var TodoApp = React.createClass({

  mixins: [TodoStore.mixin],
  storeDidChange: function () {
    // Handle store change here
  }

  ...
```
This mixin also adds listeners that call a **storeError** component method, so that if you call `this.emitError('Error Messaging')` in your store, you can respond and handle this in your components:

```javascript
var TodoStore = require('../stores/TodoStore');

var TodoApp = React.createClass({

  mixins: [TodoStore.mixin],
  storeError: function (error) {
    console.log(error);
  }

  ...
```

A simple example of how this works can be seen here:

[http://jsfiddle.net/p6q8ghpc/](http://jsfiddle.net/p6q8ghpc/)

Stores in Biff also have helpers for managing the state of the store's data. Each Biff instance has `_pending` and `_errors` properties. These are exposed via getters and setters. These methods are:

- getPending() - Returns store pending state
- getErrors() - Returns store errors array
- _setPending(arg) - Sets store pending state
- _setError(arg) - Adds an error to the store errors array
- _clearErrors() - Clears store errors array

Below, see an example of how they can be used:

```javascript
// In Your Store

var TodoStore = biff.createStore({
    getTodos: function() {
      return _todos;
    }

}, function(payload){

  switch(payload.actionType) {
    case 'ADD_START':
      this._setPending(true);
    break;

    case 'ADD_SUCCESS':
       this._setPending(false);
      addTodo(payload.text);
      this._clearErrors();
      this.emitChange();
    break;

    case 'ADD_ERROR':
      this._setPending(false);
      this._setError(payload.error);
      this.emitChange();
    break;

    default:
      return true;
  }

  return true;

});

// In your component

function getState(){
  return {
    errors: TodoStore.getErrors()
    pending: TodoStore.getPending()
    todos: TodoStore.getTodos()
  }
}

var TodoApp = React.createClass({
  mixins: [TodoStore.mixin],
  getInitialState: function () {
    return getState();
  },
  storeDidChange: function () {
    this.setState(getState());
  }
  ...

```


###Actions

Biff's **createActions** method creates an Action Creator object with the supplied singleton object. The methods of the supplied object are given an instance of the Biff instance's dispatcher object so that you can make dispatch calls from them. It is available via `this.dispatch` in the interior of your methods.

Adding actions to your app looks like this:

```javascript
var biff = require('../biff');

var TodoActions = biff.createActions({
  addTodo: function(text) {
    this.dispatch({
      actionType: 'ADD_TODO',
      text: text
    });
  }
});
```

### Async In Biff

Check out the example below to show you can handle async in Biff:

http://jsfiddle.net/29L0anf1/

## API

###Biff

```javascript
var Biff = require('biff');

module.exports = new Biff();
```

### createStore

```javascript
/*
 * @param {object} methods - Public methods for Store instance
 * @param {function} callback - Callback method for Dispatcher dispatches
 * @return {object} - Returns instance of Store
 */
```

### createActions

```javascript
/**
 * @param {object} actions - Object with methods to create actions with
 * @constructor
 */
```