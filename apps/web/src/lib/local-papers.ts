export interface PaperOverviewAnalysis {
  summary: string;
  researchQuestion: string;
  keyFindings: string[];
  whyItMatters: string;
  limitations: string[];
}

export interface LocalPaperRecord {
  id: string;
  title: string;
  sourceType: "pdf" | "doi" | "url";
  sourceValue: string;
  fileName?: string;
  contextText: string;
  createdAt: string;
  pdfBlob?: Blob;
  analysis?: PaperOverviewAnalysis;
  notebookId?: string;
  notebookError?: string;
}

const DB_NAME = "papermaxing-local";
const DB_VERSION = 1;
const STORE = "papers";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open local PaperMaxing cache."));
  });
}

function transactionRequest<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then((db) => new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = run(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local cache operation failed."));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error ?? new Error("Local cache transaction failed."));
  }));
}

export function createLocalPaperId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `paper-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveLocalPaper(record: LocalPaperRecord): Promise<IDBValidKey> {
  return transactionRequest("readwrite", (store) => store.put(record));
}

export async function getLocalPaper(id: string): Promise<LocalPaperRecord | undefined> {
  return transactionRequest<LocalPaperRecord | undefined>("readonly", (store) => store.get(id));
}

export async function updateLocalPaper(id: string, patch: Partial<LocalPaperRecord>): Promise<LocalPaperRecord> {
  const existing = await getLocalPaper(id);
  if (!existing) throw new Error("Paper not found in this browser.");
  const updated: LocalPaperRecord = { ...existing, ...patch, id: existing.id };
  await saveLocalPaper(updated);
  return updated;
}

export function listLocalPapers(): Promise<LocalPaperRecord[]> {
  return transactionRequest<LocalPaperRecord[]>("readonly", (store) => store.getAll());
}

export function deleteLocalPaper(id: string): Promise<undefined> {
  return transactionRequest<undefined>("readwrite", (store) => store.delete(id) as IDBRequest<undefined>);
}
