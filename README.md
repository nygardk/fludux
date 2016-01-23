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

Fludux exports two higher order functions: `connectToStore` and
`connectToStores`.

```js
import { connectToStore, connectToStores } from 'fludux';
```

#### connectToStore(store, mapStateToProps, config) -> connector(component)

__`store`__ (object): your Flux store that exposes changelisteners

__`mapStateToProps`__ (function): map your stores' state to props

__`config`__ (object), _optional_: if your store exposes addChangeListener and removeChangeListener
but they have different names, you can set them here. See examples below.

#### connectToStores(storeMappings) -> connector(component)

__`storeMapping`__ is an array of objects with following the properties:
`store` , `mapStateToProps`, `config`. They work simirlaly as connectToStore
arguments.

## Examples

### Simple example


__Your React component connected to a Flux store without Fludux__:

```js
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

## License

MIT
