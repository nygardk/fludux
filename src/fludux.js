import React from 'react';

const defaultConfig = {
  addChangeListener: 'addChangeListener',
  removeChangeListener: 'removeChangeListener',
};

function validateStoreMappings(storeMappings, config) {
  if (!storeMappings) {
    throw new Error('No storeMappings provided.');
  }

  storeMappings.forEach((storeMapping, index) => {
    if (!storeMapping.store) {
      throw new Error(`No store provided for storeMapping on index ${index}.`);
    }

    if (!storeMapping.store[config.addChangeListener]) {
      throw new Error(`Connected store does'not have ${config.addChangeListener} method.`);
    }

    if (!storeMapping.store[config.removeChangeListener]) {
      throw new Error(`Connected store does'not have ${config.removeChangeListener} method.`);
    }

    if (!storeMapping.mapStateToProps) {
      throw new Error(`No mapStateToProps function provided for storeMapping on index ${index}.`);
    }
  });
}

function getCombinedState(storeMappings) {
  return storeMappings
    .map(storeMapping => storeMapping.mapStateToProps(storeMapping.store))
    .reduce((acc, state) => ({ ...acc, ...state }), {});
}

export function connectToStores(mappings, config = defaultConfig) {
  let storeMappings = mappings;

  if (Object.prototype.toString.call(storeMappings) !== '[object Array]') {
    storeMappings = [storeMappings];
  }

  validateStoreMappings(storeMappings, config);

  return BaseComponent => React.createClass({
    getInitialState() {
      return getCombinedState(storeMappings);
    },

    componentDidMount() {
      storeMappings.forEach(storeMapping => {
        storeMapping.store[defaultConfig.addChangeListener](this.onStoreChange);
      });
    },

    componentWillUnmount() {
      storeMappings.forEach(storeMapping => {
        storeMapping.store[defaultConfig.removeChangeListener](this.onStoreChange);
      });
    },

    onStoreChange() {
      this.setState(getCombinedState(storeMappings));
    },

    render() {
      return <BaseComponent {...this.props} {...this.state} test="test" />;
    },
  });
}

export function connectToStore(Store, mapStateToProps, config) {
  return connectToStores({
    store: Store,
    mapStateToProps,
  }, config);
}
