import { useStore } from './StoreProvider';

export function useStoreState() {
  const store = useStore();
  if (!store) {
    throw new Error('useStoreState must be used within StoreProvider');
  }
  return store.state;
}

export function useStoreActions() {
  const store = useStore();
  if (!store) {
    throw new Error('useStoreActions must be used within StoreProvider');
  }
  return store.actions;
}

export function useStoreComputed() {
  const store = useStore();
  if (!store) {
    throw new Error('useStoreComputed must be used within StoreProvider');
  }
  return store.computed;
}
