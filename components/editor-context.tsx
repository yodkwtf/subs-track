"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useStore } from "@/lib/store";
import type { Subscription } from "@/lib/types";

interface EditorContextValue {
  openAdd: () => void;
  openEdit: (sub: Subscription) => void;
  close: () => void;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function useEditor() {
  const ctx = React.useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within <EditorProvider>");
  return ctx;
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Subscription | null>(null);
  const { addSubscription, updateSubscription } = useSubscriptions();
  const defaultCurrency = useStore((s) => s.settings.currency);

  const openAdd = React.useCallback(() => {
    setEditing(null);
    setOpen(true);
  }, []);

  const openEdit = React.useCallback((sub: Subscription) => {
    setEditing(sub);
    setOpen(true);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

  return (
    <EditorContext.Provider value={{ openAdd, openEdit, close }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-labelledby="editor-title"
          aria-describedby="editor-desc"
          className="sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle id="editor-title">
              {editing ? "Edit subscription" : "Add subscription"}
            </DialogTitle>
            <DialogDescription id="editor-desc">
              {editing
                ? `Update the details for ${editing.name}.`
                : "Track a new recurring payment."}
            </DialogDescription>
          </DialogHeader>
          {/* Remount the form per editing target so fields reset cleanly */}
          <SubscriptionForm
            key={editing?.id ?? "new"}
            initial={editing ?? undefined}
            defaultCurrency={defaultCurrency}
            onCancel={() => setOpen(false)}
            onSubmit={(draft) => {
              if (editing) updateSubscription(editing.id, draft);
              else addSubscription(draft);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </EditorContext.Provider>
  );
}
