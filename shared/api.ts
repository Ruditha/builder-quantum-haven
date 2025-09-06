/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface UploadFastaRequest {
  filename?: string | null;
  pathogen?: string | null;
  content: string; // raw FASTA content
}

export interface Mutation {
  pos: number;
  ref: string;
  alt: string;
  type: "SNP" | "INS" | "DEL" | string;
}

export interface SequenceMutations {
  id: string;
  mutations: Mutation[];
}

export interface UploadFastaResponse {
  filename: string | null;
  pathogen: string;
  sequences: { id: string; length: number }[];
  mutations: SequenceMutations[];
  summary: {
    sequences: number;
    total_mutations: number;
  };
}
