// frontend/types/challenge.ts
export interface Challenge {
  id: number;
  category: string;
  prompt: string;
  fn_name: string;
  tests: { input: unknown[]; output: unknown }[];
}
