import { EventEmitter } from 'events';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import { connectToStore } from 'fludux';

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

const MockComponent = React.createClass({
  render() {
    return (
      <div>test</div>
    );
  },
});

const ConnectedComponent = connectToStore(mockStore1, store => {
  return {
    testValue: store.getTestValue()
  };
})(MockComponent);

describe('fludux', () => {
  let node;
  let element;

  beforeEach(() => {
    testValue = 1;
    node = document.createElement('div');
    element = TestUtils.renderIntoDocument(<ConnectedComponent />, node);
  });

  it('should update component props with news one from store when a change is emitted', () => {
    expect(element.props.testValue).toBe(1);
    testValue = 2;
    mockStore1.emitChange();
    TestUtils.renderIntoDocument(<ConnectedComponent />, node);
    expect(element.props.testValue).toBe(2);
  });
});
