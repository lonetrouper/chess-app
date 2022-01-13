import { Position } from "./ChessModels";

interface IHashMap<K, V> {
  store: Map<String, V>;
  set: (key: K, value: V) => void;
  get: (key: K) => V | undefined;
  delete: (key: K) => void;
  has: (key: K) => boolean;
  getKeys: () => Position[];
}
export class HashMap<K, V> implements IHashMap<K, V> {
  store: Map<String, V>;
  constructor() {
    this.store = new Map();
  }

  set = (key: K, value: V) => {
    let modifiedKey = JSON.stringify(key);
    this.store.set(modifiedKey, value);
  };

  get = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    return this.store.get(modifiedKey);
  };
  delete = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    this.store.delete(modifiedKey);
  };
  has = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    return this.store.has(modifiedKey);
  };

  getKeys = () => {
    let keys = this.store.keys();
    let output: Position[] = [];
    for (let key in keys) {
      let pos = JSON.parse(key);
      output.push(pos);
    }
    return output;
  };
}

interface IHashSet<K> {
  store: Set<String>;
  add: (key: K) => void;
  has: (key: K) => boolean;
  delete: (key: K) => void;
  clear: () => IHashSet<K>;
}

export class HashSet<K> implements IHashSet<K> {
  store: Set<String>;
  constructor() {
    this.store = new Set();
  }
  add = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    this.store.add(modifiedKey);
  };
  has = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    return this.store.has(modifiedKey);
  };
  delete = (key: K) => {
    let modifiedKey = JSON.stringify(key);
    this.store.delete(modifiedKey);
  };
  clear = () => {
    this.store.clear();
    return this;
  };
}
