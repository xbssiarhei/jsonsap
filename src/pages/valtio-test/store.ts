import { proxy } from "valtio";
// import { proxyMap } from "valtio/utils";

export type Item = {
  id: number;
  value: number;
  lastUpdate: number;
  status: string;
};
// Store with Map
export const storeWithMap = proxy({
  items: new Map<number, Item>(),
  _isProxy: true,
  threshold: 50,
});

// Store with Array
export const storeWithArray = proxy<{
  items: Array<Item>;
}>({
  items: [],
});

export const proxyStore = proxy({
  map: 0,
  array: 0,
});

// Initialize data
const ITEMS_COUNT = 20;
const MAX_COUNT_UPDATE = Math.floor(ITEMS_COUNT / 3);
for (let i = 1; i <= ITEMS_COUNT; i++) {
  storeWithMap.items.set(
    i,
    proxy({
      id: i,
      value: 0,
      lastUpdate: 0,
      status: Math.random() > 0.5 ? "active" : "inactive",
    }),
  );
  storeWithArray.items.push({
    id: i,
    value: 0,
    lastUpdate: 0,
    status: Math.random() > 0.5 ? "active" : "inactive",
  });
}

// Update random items in Map (up to half)
export function updateRandomItemInMap() {
  const updateCount = Math.floor(Math.random() * MAX_COUNT_UPDATE) + 1;
  proxyStore.map = updateCount;
  for (let i = 0; i < updateCount; i++) {
    const randomId = Math.floor(Math.random() * ITEMS_COUNT) + 1;
    const item = storeWithMap.items.get(randomId);
    if (item) {
      item.value = Math.floor(Math.random() * 100);
      item.lastUpdate = Date.now();
      item.status = Math.random() > 0.5 ? "active" : "inactive";
    }
  }
}

// Update random items in Array (up to half)
export function updateRandomItemInArray() {
  const updateCount = Math.floor(Math.random() * MAX_COUNT_UPDATE) + 1;
  proxyStore.array = updateCount;
  for (let i = 0; i < updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * ITEMS_COUNT);
    const item = storeWithArray.items[randomIndex];
    if (item) {
      item.value = Math.floor(Math.random() * 100);
      item.lastUpdate = Date.now();
      item.status = Math.random() > 0.5 ? "active" : "inactive";
    }
  }
}
