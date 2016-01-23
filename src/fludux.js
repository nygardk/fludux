import React from 'react';

const defaultConfig = {
  addChangeListener: 'addChangeListener',
  removeChangeListener: 'removeChangeListener',
};

function validateStoreMappings(storeMappings) {
  if (!storeMappings || !storeMappings.length) {
    throw new Error('No storeMappings provided.');
  }

  storeMappings.forEach(storeMapping => {
    const config = { ...defaultConfig, ...storeMapping.config };

    if (!storeMapping.store) {
      throw new Error('No store provided for storeMapping.');
    }

    if (!storeMapping.store[config.addChangeListener]) {
      throw new Error(`Connected store is missing method "${config.addChangeListener}".`);
    }

    if (!storeMapping.store[config.removeChangeListener]) {
      throw new Error(`Connected store is missing method "${config.removeChangeListener}".`);
    }

    if (!storeMapping.mapStateToProps) {
      throw new Error('No mapStateToProps function provided for storeMapping.');
    }

    if (typeof storeMapping.mapStateToProps !== 'function') {
      throw new Error('MapStateToProps must be a function.');
    }
  });
}

function getCombinedState(storeMappings) {
  return storeMappings
    .map(storeMapping => storeMapping.mapStateToProps(storeMapping.store))
    .reduce((acc, state) => ({ ...acc, ...state }), {});
}

export function connectToStores(mappings) {
  let storeMappings = mappings;

  if (Object.prototype.toString.call(storeMappings) !== '[object Array]') {
    storeMappings = [storeMappings];
  }

  validateStoreMappings(storeMappings);

  return BaseComponent => React.createClass({
    getInitialState() {
      return getCombinedState(storeMappings);
    },

    componentDidMount() {
      storeMappings.forEach(storeMapping => {
        const config = { ...defaultConfig, ...storeMapping.config };
        storeMapping.store[config.addChangeListener](this.onStoreChange);
      });
    },

    componentWillUnmount() {
      storeMappings.forEach(storeMapping => {
        const config = { ...defaultConfig, ...storeMapping.config };
        storeMapping.store[config.removeChangeListener](this.onStoreChange);
      });
    },

    onStoreChange() {
      this.setState(getCombinedState(storeMappings));
    },

    render() {
      return <BaseComponent {...this.props} {...this.state} />;
    },
  });
}

export function connectToStore(store, mapStateToProps, config) {
  return connectToStores({ store, mapStateToProps, config });
}
