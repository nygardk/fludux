# Fludux

[![Build Status](https://travis-ci.org/nygardk/fludux.svg?branch=master)](https://travis-ci.org/nygardk/fludux)
[![npm version](https://badge.fury.io/js/fludux.svg)](https://www.npmjs.com/package/fludux)
[![codecov.io](https://codecov.io/github/nygardk/fludux/coverage.svg?branch=master)](https://codecov.io/github/nygardk/fludux?branch=master)

> Easily connect your React components to Flux stores

* remove boilerplate from your components
* map Flux stores to props instead of state
* ease your migration from Flux to Redux

## Installation

```sh
npm install --save fludux
```

## API

Fludux exports two higher order functions to connect to any Flux store:
`connectToStore` and `connectToStores`.

```js
import { connectToStore, connectToStores } from 'fludux';
```

<br />
Additionally, Fludux provides store creation utility functions `createStore`
and `createDispatcherCallback` that can help you create a store with a state
reducer function. You do not have to use these in order to use `connectToStore`
or `connectToStores`.

```js
import { createStore, createDispatcherCallback } from 'fludux';
```

#### connectToStore(store, mapStateToProps, config) -> connector(component)

__`store`__ (object): your Flux store that exposes changelisteners

__`mapStateToProps`__ (function): map your stores' state to props

__`config`__ (object), _optional_: if your store exposes addChangeListener and removeChangeListener
but they have different names, you can set them here. See examples below.

#### connectToStores(storeMappings) -> connector(component)

__`storeMapping`__ (array{object}) : an array of objects with the following properties:
`store` , `mapStateToProps`, `config`. They work simirlaly as connectToStore
arguments.

#### createStore(initialState) -> store

__`initialState`__ (object): the initial state object of your state.
E.g. `{isLoading: false}`.

__`store`__ (object): created Flux store with methods `emitChange`,
`addChangeListener`, `removeChangeListener`, `getState` and `setState`.

#### createDispatcherCallback(reducer, store) -> actionCallback(action)

__`reducer`__ (function): a reducer function that gets previous state as first
parameter, and the action object as second parameter. Returns new state.
(See an example below).

## Examples

### Connection to a store: a simple example

__Your React component connected to a Flux store without Fludux__:

```js
import MyStore from 'MyStore';

function getState() {
  return {
    someValue: MyStore.getSomeValue()
  };
}

const MyComponent = React.createClass({
  getInitialState() {
    return getState();
  },

  componentWillMount() {
    MyStore.addChangeListener(this.onChange);
  },

  componentDidUnmount() {
    MyStore.removeChangeListener(this.onChange);
  },

  onChange() {
    this.setState(getState());
  },

  render() {
    return (
      <div>{this.state.someValue}</div>
    );
  }
});

export default MyComponent;

```

__Your React component with Fludux__:


```js
import { connectToStore } from 'fludux';
import MyStore from 'MyStore';

const MyComponent = React.createClass({
  propTypes: {
    someValue: React.PropTypes.string
  },

  render() {
    return (
      <div>{this.props.someValue}</div>
    );
  }
});

export default connectToStore(MyStore, store => ({
  someValue: store.getSomeValue()
}))(MockComponent);

```

### Connecting to multiple stores

```js
import { connectToStores } from 'fludux';
import MyStore1 from 'MyStore1';
import MyStore2 from 'MyStore2';

const MyComponent = React.createClass({
  propTypes: {
    someValue1: React.PropTypes.string,
    someValue2: React.PropTypes.string
  },

  render() {
    return (
      <div>{this.props.someValue}</div>
    );
  }
});

export default connectToStores([
  {
    store: MyStore1,
    mapStateToProps: Store => ({someValue1: Store.getSomeValue() })
  },
  {
    store: MyStore2,
    mapStateToProps: Store => ({someValue2: Store.getSomeValue() }),
    config: {
      addChangeListener: 'myCustomNameForAddChangeListener',
      removeChangeListener: 'myCustomNameForRemoveChangeListener'
    }
  }
])(MockComponent);
```

### Creating a store with createStore and createDispatcherCallback

```js
import { createStore, createDispatcherCallback } from 'fludux';
import AppDispatcher from 'some/where/AppDispatcher';

const INITIAL_STATE = {isLoading: false};

const MyStore = createStore(INITIAL_STATE);

const myStoreReducer = function(state, action) {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        isLoading: true
      };

    case 'LOADING_DONE':
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
}

AppDispatcher.register(createDispatcherCallback(
  myStoreReducer,
  MyStore
));

export default MyStore;
```

## License

MIT
