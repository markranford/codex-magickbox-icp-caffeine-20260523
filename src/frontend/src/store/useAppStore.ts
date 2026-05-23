/**
 * useAppStore — NON-AUTHORITATIVE LOCAL / CONTROL-PLANE STATE
 *
 * This Zustand store holds UI-local state only. It is NOT a source of truth
 * for credits, payments, media, or canister state. Authoritative durable state
 * lives on external ICP canisters configured in /canister-config.
 *
 * Persisted to localStorage under key 'magickbox-icp-control-plane-state'.
 */

import type {
  AppState,
  CanisterConfig,
  ICPMediaManifest,
  JobRecord,
  PaymentIntent,
  ProviderConfig,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppActions {
  // Providers
  addProvider: (provider: ProviderConfig) => void;
  updateProvider: (id: string, updates: Partial<ProviderConfig>) => void;
  removeProvider: (id: string) => void;
  // Canisters
  addCanister: (canister: CanisterConfig) => void;
  updateCanister: (id: string, updates: Partial<CanisterConfig>) => void;
  // Jobs
  addJob: (job: JobRecord) => void;
  updateJob: (id: string, updates: Partial<JobRecord>) => void;
  // Payment Intents
  addPaymentIntent: (intent: PaymentIntent) => void;
  updatePaymentIntent: (id: string, updates: Partial<PaymentIntent>) => void;
  markIntentVerified: (id: string, txHash: string) => void;
  // Manifests
  addManifest: (manifest: ICPMediaManifest) => void;
  removeManifest: (manifestId: string) => void;
  // Credits (non-authoritative display only)
  setCreditBalance: (balance: number | null) => void;
}

const DEFAULT_CANISTERS: CanisterConfig[] = [
  {
    id: "core",
    name: "core",
    description:
      "Core Magick Box canister — user registry, auth, session state",
  },
  {
    id: "media",
    name: "media",
    description:
      "Media storage canister — ICP-native media manifests and chunks",
  },
  {
    id: "ledger",
    name: "ledger",
    description:
      "ICRC-1/ICRC-2 ledger canister — token transfers and approvals",
  },
  {
    id: "ad-verifier",
    name: "ad-verifier",
    description:
      "Ad verification canister — content moderation and ad-spend proofs",
  },
  {
    id: "ai-worker",
    name: "ai-worker",
    description: "AI worker canister — dispatches generation jobs to providers",
  },
];

const INITIAL_STATE: AppState = {
  providers: [],
  canisters: DEFAULT_CANISTERS,
  jobs: [],
  paymentIntents: [],
  manifests: [],
  creditBalance: null,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      // ── Providers ──────────────────────────────────────────────────────────
      addProvider: (provider) =>
        set((s) => ({ providers: [...s.providers, provider] })),

      updateProvider: (id, updates) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      removeProvider: (id) =>
        set((s) => ({ providers: s.providers.filter((p) => p.id !== id) })),

      // ── Canisters ──────────────────────────────────────────────────────────
      addCanister: (canister) =>
        set((s) => ({ canisters: [...s.canisters, canister] })),

      updateCanister: (id, updates) =>
        set((s) => ({
          canisters: s.canisters.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      // ── Jobs ───────────────────────────────────────────────────────────────
      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),

      updateJob: (id, updates) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),

      // ── Payment Intents ────────────────────────────────────────────────────
      addPaymentIntent: (intent) =>
        set((s) => ({ paymentIntents: [intent, ...s.paymentIntents] })),

      updatePaymentIntent: (id, updates) =>
        set((s) => ({
          paymentIntents: s.paymentIntents.map((i) =>
            i.id === id ? { ...i, ...updates } : i,
          ),
        })),

      markIntentVerified: (id, txHash) =>
        set((s) => ({
          paymentIntents: s.paymentIntents.map((i) =>
            i.id === id
              ? { ...i, status: "verified" as const, verifiedTxHash: txHash }
              : i,
          ),
        })),

      // ── Manifests ──────────────────────────────────────────────────────────
      addManifest: (manifest) =>
        set((s) => ({
          manifests: [
            manifest,
            ...s.manifests.filter((m) => m.manifestId !== manifest.manifestId),
          ],
        })),

      removeManifest: (manifestId) =>
        set((s) => ({
          manifests: s.manifests.filter((m) => m.manifestId !== manifestId),
        })),

      // ── Credits (display only — non-authoritative) ─────────────────────────
      setCreditBalance: (balance) => set({ creditBalance: balance }),
    }),
    {
      name: "magickbox-icp-control-plane-state",
      // Only persist the data fields, not the action functions
      partialize: (state) => ({
        providers: state.providers,
        canisters: state.canisters,
        jobs: state.jobs,
        paymentIntents: state.paymentIntents,
        manifests: state.manifests,
        creditBalance: state.creditBalance,
      }),
    },
  ),
);
