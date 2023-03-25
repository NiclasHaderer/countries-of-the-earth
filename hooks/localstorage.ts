import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : initialValue);
  }, [initialValue, key]);

  return [
    storedValue,
    value => {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
  ];
};
