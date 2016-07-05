import {
  createStore,
  createDispatcherCallback,
} from 'fludux';

describe('createStore', () => {
  let store;

  beforeEach(() => {
    store = createStore({ test: 'test123' });
  });

  describe('getState', () => {
    it('should return the state', () => {
      expect(store.getState()).toEqual({ test: 'test123' });
    });
  });

  describe('setState', () => {
    it('should set the state', () => {
      store.setState({ test: 'test321' });
      expect(store.getState()).toEqual({ test: 'test321' });
    });

    it('should trigger registered changeListeners', () => {
      const testListener = jasmine.createSpy();

      store.addChangeListener(testListener);

      expect(testListener).not.toHaveBeenCalled();
      store.setState({ test: 'test222222' });
      expect(testListener).toHaveBeenCalled();
    });

    it('should not trigger a removed changeListener', () => {
      const testListener = jasmine.createSpy();

      store.addChangeListener(testListener);
      store.removeChangeListener(testListener);

      store.setState({ test: 'test222222' });
      expect(testListener).not.toHaveBeenCalled();
    });
  });
});

describe('createDispatcherCallback', () => {
  let store;
  let dispatcherCallback;

  const reducer = (state, action) => {
    switch (action) {
      case 'TEST_ACTION_1':
        return {
          test: 'testactiondone',
        };
      case 'TEST_ACTION_2':
        return undefined;
      default:
        return state;
    }
  };

  beforeEach(() => {
    store = createStore({ test: 'test123' });
    dispatcherCallback = createDispatcherCallback(reducer, store);
  });

  it('should create an action creator', () => {
    expect(typeof dispatcherCallback).toEqual('function');
  });

  it('should cause the store state to change when an action is dispatched', () => {
    dispatcherCallback('TEST_ACTION_1');

    expect(store.getState()).toEqual({ test: 'testactiondone' });
  });

  it('should not cause the store state to change when reducer does not return state', () => {
    dispatcherCallback('TEST_ACTION_2');

    expect(store.getState()).toEqual({ test: 'test123' });
  });
});
