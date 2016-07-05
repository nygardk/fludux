import { EventEmitter } from 'events';

const CHANGE_EVENT = 'CHANGE';

export function createStore(initialState) {
  let state = initialState;

  return {
    ...EventEmitter.prototype,

    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    setState(newState) {
      state = newState;
      this.emitChange();
    },

    getState() {
      return state;
    },
  };
}

function stateUpdaterCreator(stateCreator, getState, setState) {
  return action => {
    const newState = stateCreator(getState(), action);

    if (newState) {
      setState(newState);
    }
  };
}

export function createDispatcherCallback(stateCreator, store) {
  return stateUpdaterCreator(
    stateCreator,
    function getter() { return store.getState(); },
    function setter(state) { return store.setState(state); },
  );
}
