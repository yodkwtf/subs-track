import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscription, ActivityItem, Settings, ActivityType } from "./types";
import { SEED_SUBSCRIPTIONS, DEFAULT_CURRENCY } from "./constants";
import { uid, normalizeName } from "./utils";

export const DEFAULT_SETTINGS: Settings = {
  currency: DEFAULT_CURRENCY,
  reminderThreshold: 7,
};

interface SubscriptionState {
  subscriptions: Subscription[];
  activity: ActivityItem[];
  settings: Settings;
  hydrated: boolean;

  addSubscription: (sub: Omit<Subscription, "id">) => string | null;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  archiveSubscription: (id: string) => void;
  setStatus: (id: string, status: Subscription["status"]) => void;

  updateSettings: (patch: Partial<Settings>) => void;

  importData: (data: { subscriptions: Subscription[]; settings?: Settings }) => void;
  loadSampleData: () => void;
  clearAll: () => void;
  replaceAll: (data: {
    subscriptions: Subscription[];
    activity?: ActivityItem[];
    settings?: Settings;
  }) => void;
  setHydrated: (v: boolean) => void;
}

function logActivity(
  activity: ActivityItem[],
  type: ActivityType,
  name: string
): ActivityItem[] {
  const entry: ActivityItem = {
    id: uid(),
    type,
    subscriptionName: name,
    timestamp: new Date().toISOString(),
  };
  return [entry, ...activity].slice(0, 30);
}

export const useStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: SEED_SUBSCRIPTIONS,
      activity: [],
      settings: DEFAULT_SETTINGS,
      hydrated: false,

      addSubscription: (sub) => {
        const exists = get().subscriptions.some(
          (s) => s.status !== "Cancelled" && normalizeName(s.name) === normalizeName(sub.name)
        );
        if (exists) return null;

        const id = uid();
        const newSub: Subscription = { ...sub, id };
        set((state) => ({
          subscriptions: [newSub, ...state.subscriptions],
          activity: logActivity(state.activity, "added", sub.name),
        }));
        return id;
      },

      updateSubscription: (id, patch) => {
        set((state) => {
          const existing = state.subscriptions.find((s) => s.id === id);
          return {
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, ...patch } : s
            ),
            activity: existing
              ? logActivity(state.activity, "edited", patch.name ?? existing.name)
              : state.activity,
          };
        });
      },

      deleteSubscription: (id) => {
        set((state) => {
          const existing = state.subscriptions.find((s) => s.id === id);
          return {
            subscriptions: state.subscriptions.filter((s) => s.id !== id),
            activity: existing
              ? logActivity(state.activity, "cancelled", existing.name)
              : state.activity,
          };
        });
      },

      archiveSubscription: (id) => {
        set((state) => {
          const existing = state.subscriptions.find((s) => s.id === id);
          return {
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status: "Cancelled" } : s
            ),
            activity: existing
              ? logActivity(state.activity, "cancelled", existing.name)
              : state.activity,
          };
        });
      },

      setStatus: (id, status) => {
        set((state) => {
          const existing = state.subscriptions.find((s) => s.id === id);
          const type: ActivityType =
            status === "Paused" ? "paused" : status === "Active" ? "resumed" : "cancelled";
          return {
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status } : s
            ),
            activity: existing
              ? logActivity(state.activity, type, existing.name)
              : state.activity,
          };
        });
      },

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      importData: (data) =>
        set((state) => ({
          subscriptions: data.subscriptions ?? state.subscriptions,
          settings: data.settings ?? state.settings,
          activity: logActivity(state.activity, "added", "Imported data"),
        })),

      loadSampleData: () =>
        set((state) => ({
          subscriptions: SEED_SUBSCRIPTIONS,
          activity: logActivity(state.activity, "added", "Sample data"),
        })),

      clearAll: () =>
        set({
          subscriptions: [],
          activity: [],
          settings: DEFAULT_SETTINGS,
        }),

      replaceAll: ({ subscriptions, activity, settings }) =>
        set((state) => ({
          subscriptions,
          activity: activity ?? [],
          settings: settings ?? state.settings,
        })),

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "payora-v1",
      partialize: (state) => ({
        subscriptions: state.subscriptions,
        activity: state.activity,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
