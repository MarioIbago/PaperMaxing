export type ProvenanceMode = "paper_says" | "source_data" | "papermaxing_explains" | "papermaxing_infers";
export type ClaimType = "descriptive" | "causal" | "correlational" | "methodological" | "theoretical" | "normative" | "speculative";
export interface SourcePointer { paperId:string; sectionId?:string; chunkId?:string; page?:number; paragraph?:number; figureId?:string; tableId?:string; }
export interface Evidence { id:string; relation:"supports"|"contradicts"|"context"|"limitation"; source:SourcePointer; exactText?:string; }
export interface Claim { id:string; paperId:string; text:string; type:ClaimType; provenance:ProvenanceMode; evidenceIds:string[]; confidence?:number; }
export interface GroundedStatement { text:string; mode:ProvenanceMode; evidenceIds:string[]; }
export interface GroundedAnswer { answer:string; statements:GroundedStatement[]; abstained:boolean; }
