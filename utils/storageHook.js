import { positionType } from "./types.js";

const useLocalStorate = () => {
  const getAllFromStorage = (key) => {
    const result = JSON.parse(localStorage.getItem(key));
    return result;
  }

  const deleteStorage = (key) => {
    localStorage.removeItem(key);
  }

  const addStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const addItemToStorage = (key, newItem, position) => {
    const oldStorage = getAllFromStorage(key);

    if (position === positionType.first) {
      oldStorage.unshift(newItem);
    } else {
      oldStorage.push(newItem);
    }

    deleteStorage(key);
    addStorage(key, oldStorage);
  };

  const deleteOne = (key, id) => {
    const oldStorage = getAllFromStorage(key);

    const newStorage = oldStorage.filter((item) => item.id !== id);
    deleteStorage(key);
    addStorage(key, newStorage);
  }

  const updateStorageItem = (key, id, newItem) => {
    const oldStorage = getAllFromStorage(key);
    const newStorage = oldStorage.map((item) => item.id === id ? newItem : item);

    deleteStorage(key);
    addStorage(key, newStorage);
  };

  return {
    addItemToStorage,
    updateStorageItem,
    getAllFromStorage,
    deleteStorage,
    addStorage,
    deleteOne,
  };
};

export default useLocalStorate;
