import { EventEmitter } from 'events';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { findDOMNode } from 'react-dom';
import {
  connectToStore,
  connectToStores,
} from 'fludux';

let testValue;

const mockStore1 = {
  ...EventEmitter.prototype,

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  },

  getTestValue() {
    return testValue;
  },
};

const mockStore2 = {
  ...EventEmitter.prototype,

  emitChange() {
    this.emit('change');
  },

  customAddChangeListener(callback) {
    this.on('change', callback);
  },

  customRemoveChangeListener(callback) {
    this.removeListener('change', callback);
  },

  getTestValue() {
    return testValue + 1;
  },
};

describe('connectToStore', () => {
  it('should throw error if no store provided', () => {
    expect(() => {
      connectToStore(undefined);
    }).toThrowError();
  });

  it('should throw error if no mapping function is provided', () => {
    expect(() => {
      connectToStore(mockStore1, undefined);
    }).toThrowError();
  });

  it('should not throw error if a a store and a mapping are provided', () => {
    expect(() => {
      connectToStore(mockStore1, () => {});
    }).not.toThrowError();
  });

  it('should throw error if mapping argument is not a function', () => {
    expect(() => {
      connectToStore(mockStore1, []);
    }).toThrowError();
  });

  it('should throw error if store does not have correct listener addChangeListener', () => {
    expect(() => {
      connectToStore(mockStore1, () => {}, {
        addChangeListener: 'someOtherAddChangeListener',
        removeChangeListener: 'removeChangeListener',
      });
    }).toThrowError();
  });

  it('should throw error if store does not have correct listener removeChangeListener', () => {
    expect(() => {
      connectToStore(mockStore1, () => {}, {
        addChangeListener: 'addChangeListener',
        removeChangeListener: 'someOtherRemoveChangeListener',
      });
    }).toThrowError();
  });

  it('should not throw error if store does have correct listener methods', () => {
    expect(() => {
      connectToStore(mockStore2, () => {}, {
        addChangeListener: 'customAddChangeListener',
        removeChangeListener: 'customRemoveChangeListener',
      });
    }).not.toThrowError();
  });
});

describe('connectToStores', () => {
  it('should throw error if storeMappings is undefined', () => {
    expect(() => {
      connectToStores(undefined);
    }).toThrowError();
  });

  it('should throw error if storeMappings is empty array', () => {
    expect(() => {
      connectToStores([]);
    }).toThrowError();
  });

  it('should throw error if any of the provided storeMappings lack store', () => {
    expect(() => {
      connectToStores([
        {
          store: mockStore1,
          mapStateToProps: () => {},
        },
        {
          mapStateToProps: () => {},
        },
      ]);
    }).toThrowError();
  });

  it('should throw error if any of the provided storeMappings lack mapStateToProps func', () => {
    expect(() => {
      connectToStores([
        {
          store: mockStore1,
          mapStateToProps: () => {},
        },
        {
          store: mockStore2,
        },
      ]);
    }).toThrowError();
  });

  it('should throw error if any of the provided storeMappings has invalid config', () => {
    expect(() => {
      connectToStores([
        {
          store: mockStore1,
          mapStateToProps: () => {},
        },
        {
          store: mockStore2,
          mapStateToProps: () => {},
        },
      ]);
    }).toThrowError();
  });

  it('should not throw error with valid mappings', () => {
    expect(() => {
      connectToStores([
        {
          store: mockStore1,
          mapStateToProps: () => {},
        },
        {
          store: mockStore2,
          mapStateToProps: () => {},
          config: {
            addChangeListener: 'customAddChangeListener',
            removeChangeListener: 'customRemoveChangeListener',
          },
        },
      ]);
    }).not.toThrowError();
  });
});

describe('connected component to a single store', () => {
  const MockComponent = React.createClass({
    propTypes: {
      testValue: React.PropTypes.number,
    },

    render() {
      return (
        <div>{this.props.testValue}</div>
      );
    },
  });

  const ConnectedComponent = connectToStore(mockStore1, store => {
    return {
      testValue: store.getTestValue(),
    };
  })(MockComponent);

  let node;
  let element;

  beforeEach(() => {
    testValue = 1;
    node = document.createElement('div');
    element = TestUtils.renderIntoDocument(<ConnectedComponent />, node);
  });

  it('should be rendered with the initial values from store', () => {
    expect(findDOMNode(element).textContent).toEqual('1');
  });

  it('should update component props with new ones from the store when a change is emitted', () => {
    testValue = 2;
    mockStore1.emitChange();
    TestUtils.renderIntoDocument(<ConnectedComponent />, node);
    expect(findDOMNode(element).textContent).toEqual('2');

    testValue = 3;
    mockStore1.emitChange();
    TestUtils.renderIntoDocument(<ConnectedComponent />, node);
    expect(findDOMNode(element).textContent).toEqual('3');
  });

  it('should call removeChangeListener on component unmount', () => {
    spyOn(mockStore1, 'removeChangeListener');
    element.componentWillUnmount();

    expect(mockStore1.removeChangeListener).toHaveBeenCalled();
  });
});

describe('connected component to multiple stores', () => {
  const MockComponent = React.createClass({
    propTypes: {
      testValue1: React.PropTypes.number,
      testValue2: React.PropTypes.number,
    },

    render() {
      return (
        <div>{this.props.testValue1},{this.props.testValue2}</div>
      );
    },
  });

  const ConnectedComponent = connectToStores([
    {
      store: mockStore1,
      mapStateToProps: Store => ({ testValue1: Store.getTestValue() }),
    },
    {
      store: mockStore2,
      mapStateToProps: Store => ({ testValue2: Store.getTestValue() }),
      config: {
        addChangeListener: 'customAddChangeListener',
        removeChangeListener: 'customRemoveChangeListener',
      },
    },
  ])(MockComponent);

  let node;
  let element;

  beforeEach(() => {
    testValue = 1;
    node = document.createElement('div');
    element = TestUtils.renderIntoDocument(<ConnectedComponent />, node);
  });

  it('should be rendered with the initial values from store', () => {
    expect(findDOMNode(element).textContent).toEqual('1,2');
  });

  it('should update component props with new ones from the store when ' +
  'a change is emitted', () => {
    testValue = 2;
    mockStore1.emitChange();
    TestUtils.renderIntoDocument(<ConnectedComponent />, node);
    expect(findDOMNode(element).textContent).toEqual('2,3');

    testValue = 3;
    mockStore1.emitChange();
    TestUtils.renderIntoDocument(<ConnectedComponent />, node);
    expect(findDOMNode(element).textContent).toEqual('3,4');
  });

  it('should call all removeChangeListeners on component unmount', () => {
    spyOn(mockStore1, 'removeChangeListener');
    spyOn(mockStore2, 'customRemoveChangeListener');
    element.componentWillUnmount();

    expect(mockStore1.removeChangeListener).toHaveBeenCalled();
    expect(mockStore2.customRemoveChangeListener).toHaveBeenCalled();
  });
});
