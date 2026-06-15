import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscription, ActivityItem, Settings, ActivityType } from "./types";
import { SEED_SUBSCRIPTIONS } from "./constants";
import { uid } from "./utils";

interface SubscriptionState {
  subscriptions: Subscription[];
  activity: ActivityItem[];
  settings: Settings;
  hydrated: boolean;

  // CRUD
  addSubscription: (sub: Omit<Subscription, "id">) => string;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  archiveSubscription: (id: string) => void; // soft delete -> Cancelled
  setStatus: (id: string, status: Subscription["status"]) => void;

  // settings
  updateSettings: (patch: Partial<Settings>) => void;

  // data management
  importData: (data: { subscriptions: Subscription[]; settings?: Settings }) => void;
  clearAll: () => void;
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
      settings: { currency: "USD", reminderThreshold: 7 },
      hydrated: false,

      addSubscription: (sub) => {
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

      clearAll: () =>
        set({
          subscriptions: [],
          activity: [],
          settings: { currency: "USD", reminderThreshold: 7 },
        }),

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "subscription-tracker-v1",
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
