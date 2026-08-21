export interface LocalPaper {
  id: string;
  name: string;
  size: number;
  sha256: string;
  createdAt: number;
  text: string;
  pageCount: number;
  file: Blob;
}

export interface LocalAnalysis {
  id: string;
  paperId: string;
  provider: string;
  model: string;
  question: string;
  answer: string;
  createdAt: number;
}

const DB_NAME = "papermaxing-local";
const DB_VERSION = 1;
const PAPER_STORE = "papers";
const ANALYSIS_STORE = "analyses";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PAPER_STORE)) db.createObjectStore(PAPER_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(ANALYSIS_STORE)) db.createObjectStore(ANALYSIS_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open IndexedDB"));
  });
}

async function withStore<T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const request = operation(tx.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
    tx.oncomplete = () => db.close();
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error("IndexedDB transaction failed")); };
  });
}

export async function savePaper(paper: LocalPaper) { await withStore(PAPER_STORE, "readwrite", s => s.put(paper)); }
export async function listPapers(): Promise<LocalPaper[]> { return withStore(PAPER_STORE, "readonly", s => s.getAll()); }
export async function deletePaper(id: string) { await withStore(PAPER_STORE, "readwrite", s => s.delete(id)); }
export async function saveAnalysis(analysis: LocalAnalysis) { await withStore(ANALYSIS_STORE, "readwrite", s => s.put(analysis)); }
export async function listAnalyses(): Promise<LocalAnalysis[]> { return withStore(ANALYSIS_STORE, "readonly", s => s.getAll()); }
