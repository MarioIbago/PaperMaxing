import type { GroundedResearchProvider } from "./contracts";
export interface NotebookLMProviderOptions { baseUrl:string; token:string; }
export class NotebookLMProvider implements GroundedResearchProvider {
  readonly id="notebooklm"; private readonly baseUrl:string; private readonly token:string;
  constructor(options:NotebookLMProviderOptions){this.baseUrl=options.baseUrl.replace(/\/$/,"");this.token=options.token;}
  private async request<T>(path:string,init:RequestInit={}):Promise<T>{const headers=new Headers(init.headers);headers.set("Authorization",`Bearer ${this.token}`);if(init.body&&!(init.body instanceof FormData)&&!headers.has("Content-Type"))headers.set("Content-Type","application/json");const response=await fetch(`${this.baseUrl}${path}`,{...init,headers,cache:"no-store"});if(!response.ok)throw new Error(`NotebookLM ${response.status}: ${await response.text()}`);if(response.status===204)return undefined as T;return response.json() as Promise<T>;}
  health(){return this.request<{ok:boolean}>("/healthz");}
  createNotebook(title:string){return this.request<{id:string;title?:string;[key:string]:unknown}>("/v1/notebooks",{method:"POST",body:JSON.stringify({title})});}
  addUrl(notebookId:string,url:string){return this.request<Record<string,unknown>>(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/url`,{method:"POST",body:JSON.stringify({url})});}
  addText(notebookId:string,text:string,title?:string){return this.request<Record<string,unknown>>(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/text`,{method:"POST",body:JSON.stringify({text,title})});}
  addFile(notebookId:string,file:Blob,filename:string,title?:string){const body=new FormData();body.append("file",file,filename);if(title)body.append("title",title);return this.request<Record<string,unknown>>(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/file`,{method:"POST",body});}
  async ask(notebookId:string,question:string,conversationId?:string){const raw=await this.request<Record<string,unknown>>(`/v1/notebooks/${encodeURIComponent(notebookId)}/chat`,{method:"POST",body:JSON.stringify({question,conversation_id:conversationId})});return{answer:String(raw.answer??""),references:Array.isArray(raw.references)?raw.references:[],conversationId:typeof raw.conversation_id==="string"?raw.conversation_id:undefined,raw};}
}
