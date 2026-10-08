export interface Founder { name: string; role: string; notes: string }
export interface Concept { name: string; needs: string[]; avoid: string[]; hook: string; tags: string[]; scope: number; kick: number; id: string; fit: number; feasibility: number; campaign: number; final: number }
export interface Comparable { title: string; type: string; price: string; signal: string; evidence: string }
export type Answer = number | string | string[];
export interface FoundryState {
  founders: Founder[];
  answers: Record<string, Answer>[];
  shared: { mvpMonths: number; mvpBudget: number; teamHours: number; engine: string };
  concepts: Concept[];
  votes: Record<string, number[]>;
  market: Record<string, number>;
  comparables: Comparable[];
}
export interface Dimension { vals: number[]; mean: number; sd: number; score: number }
export interface Question { id: string; text: string; section: string; type: 'scale' | 'multi' | 'text'; dim?: string; options?: string[] }
export const Q: Question[];
export const DIM_LABELS: Record<string, string>;
export const SECTIONS: { id: string; title: string; desc: string }[];
export const defaultState: FoundryState;
export const conceptTemplates: Omit<Concept, 'id' | 'fit' | 'feasibility' | 'campaign' | 'final'>[];
export const gateDefs: [string, string, number][];
export function validateImportedState(data: unknown): FoundryState;
export function computeConcepts(state: FoundryState): Concept[];
export function dimensionScores(state: FoundryState): Record<string, Dimension>;
