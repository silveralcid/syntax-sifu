export interface SubmitResult {
  status: "ok";
  model: string;
  results: Record<string, unknown>;
}

export interface SubmitError {
  status: "error";
  message: string;
}

export type SubmitResponse = SubmitResult | SubmitError;
