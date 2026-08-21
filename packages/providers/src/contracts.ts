export interface StructuredGenerationRequest { system:string; prompt:string; jsonSchema?:unknown; }
export interface AIProvider { readonly id:string; generateText(input:{system:string;prompt:string}):Promise<string>; generateStructured<T>(input:StructuredGenerationRequest):Promise<T>; }
export interface ParserProvider { parsePdf(file:Uint8Array):Promise<unknown>; }
export interface PaperMetadataProvider { lookup(input:{doi?:string;title?:string;author?:string}):Promise<unknown>; }
export interface GroundedReference { sourceId?:string; citation?:string; text?:string; raw?:unknown; }
export interface GroundedAnswer { answer:string; references:GroundedReference[]; conversationId?:string; raw?:unknown; }
export interface GroundedResearchProvider { readonly id:string; health():Promise<{ok:boolean}>; createNotebook(title:string):Promise<{id:string;title?:string;[key:string]:unknown}>; addUrl(notebookId:string,url:string):Promise<Record<string,unknown>>; addText(notebookId:string,text:string,title?:string):Promise<Record<string,unknown>>; addFile(notebookId:string,file:Blob,filename:string,title?:string):Promise<Record<string,unknown>>; ask(notebookId:string,question:string,conversationId?:string):Promise<GroundedAnswer>; }
