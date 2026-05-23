// ── Shared TypeScript Types ──────────────────────────────────────────────────
// All types represent local / control-plane state only.
// Authoritative durable state lives on external ICP canisters.

export type ProviderType = "freelllm" | "openai" | "magickai" | "ollama";
export type TestStatus = "ok" | "error" | "untested";
export type CanisterName =
  | "core"
  | "media"
  | "ledger"
  | "ad-verifier"
  | "ai-worker";
export type JobMode = "image" | "video" | "music";
export type JobStatus = "pending" | "in-progress" | "complete" | "error";
export type PaymentStatus = "pending" | "verified" | "expired";
export type ChunkStatus = "verified" | "unverified";

export interface ProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  endpointUrl: string;
  apiKey?: string;
  isActive: boolean;
  testedAt?: string;
  testStatus?: TestStatus;
}

export interface CanisterConfig {
  id: string;
  name: CanisterName;
  canisterId?: string;
  endpointUrl?: string;
  description: string;
  testedAt?: string;
  testStatus?: TestStatus;
}

export interface JobRecord {
  id: string;
  prompt: string;
  mode: JobMode;
  providerId: string;
  timestamp: string;
  status: JobStatus;
  outputUrl?: string;
  errorMessage?: string;
  providerMetadata?: Record<string, string>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  description?: string;
  subaccountId: string;
  icrc2Payload: string;
  createdAt: string;
  status: PaymentStatus;
  verifiedTxHash?: string;
}

export interface ICPMediaChunk {
  chunkId: string;
  contentType: string;
  sizeBytes: number;
  status: ChunkStatus;
}

export interface ICPMediaManifest {
  manifestId: string;
  owner: string;
  version: number;
  chunks: ICPMediaChunk[];
  importedAt: string;
  source: "icp-manifest";
}

export interface AppState {
  providers: ProviderConfig[];
  canisters: CanisterConfig[];
  jobs: JobRecord[];
  paymentIntents: PaymentIntent[];
  manifests: ICPMediaManifest[];
  creditBalance: number | null;
}
