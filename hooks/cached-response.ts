import { useEffect, useState } from "react";

const getDatabase = (dbName: string) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("responses", { keyPath: "url" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const saveResponse = async (db: IDBDatabase, url: string, response: object) =>
  new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("responses", "readwrite");
    const store = transaction.objectStore("responses");
    const request = store.put({ url, response });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

const getResponse = async (db: IDBDatabase, url: string) =>
  new Promise<object>((resolve, reject) => {
    const transaction = db.transaction("responses", "readonly");
    const store = transaction.objectStore("responses");
    const request = store.get(url);

    request.onsuccess = () => resolve(request.result?.response || null);
    request.onerror = () => reject(request.error);
  });

export const useCachedResponse = <T extends object>(url: string) => {
  const [response, setResponse] = useState<{ loading: true; data: undefined } | { loading: false; data: T }>({
    data: undefined,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const db = await getDatabase("cached-responses");
      const response = (await getResponse(db, url)) as T;
      if (response) {
        setResponse({ data: response, loading: false });
      } else {
        const response = await fetch(url).then(r => r.json());
        await saveResponse(db, url, response);
        setResponse({ data: response, loading: false });
      }
    })();
  }, [url]);

  return response;
};
