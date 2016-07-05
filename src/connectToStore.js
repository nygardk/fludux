import connectToStores from './connectToStores';

export default function connectToStore(store, mapStateToProps, config) {
  return connectToStores({ store, mapStateToProps, config });
}
