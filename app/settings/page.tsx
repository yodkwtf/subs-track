"use client";

import * as React from "react";
import { Download, Upload, Trash2, Coins, BellRing, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { CURRENCIES, REMINDER_THRESHOLDS } from "@/lib/constants";
import type { CurrencyCode, Subscription } from "@/lib/types";

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const subscriptions = useStore((s) => s.subscriptions);
  const importData = useStore((s) => s.importData);
  const clearAll = useStore((s) => s.clearAll);

  const fileRef = React.useRef<HTMLInputElement>(null);
  const [importError, setImportError] = React.useState<string>("");
  const [importedCount, setImportedCount] = React.useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleExport = () => {
    const payload = JSON.stringify({ subscriptions, settings }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subtrack-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    setImportedCount(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const subs: Subscription[] = Array.isArray(data.subscriptions)
          ? data.subscriptions
          : Array.isArray(data)
            ? data
            : [];
        if (subs.length === 0) throw new Error("No subscriptions found in file.");
        importData({ subscriptions: subs, settings: data.settings });
        setImportedCount(subs.length);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Preferences and your data. Everything is stored locally in your browser.
      </p>

      {/* Preferences */}
      <Card className="glass p-5">
        <h2 className="mb-4 font-semibold">Preferences</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="currency" className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              Default currency
            </Label>
            <Select
              value={settings.currency}
              onValueChange={(v) => updateSettings({ currency: v as CurrencyCode })}
            >
              <SelectTrigger id="currency" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} — {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="threshold" className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-muted-foreground" />
              Reminder threshold
            </Label>
            <Select
              value={String(settings.reminderThreshold)}
              onValueChange={(v) =>
                updateSettings({ reminderThreshold: Number(v) as 3 | 7 | 14 })
              }
            >
              <SelectTrigger id="threshold" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_THRESHOLDS.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} days before
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Data management */}
      <Card className="glass p-5">
        <h2 className="mb-1 font-semibold">Your data</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {subscriptions.length} subscription{subscriptions.length === 1 ? "" : "s"} stored.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
            aria-hidden
          />
        </div>
        {importedCount !== null && (
          <p className="mt-3 text-sm text-emerald-400" role="status">
            Imported {importedCount} subscription{importedCount === 1 ? "" : "s"}.
          </p>
        )}
        {importError && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {importError}
          </p>
        )}
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="font-semibold">Danger zone</h2>
        </div>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Permanently delete all subscriptions and activity. This cannot be undone.
        </p>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" /> Clear all data
        </Button>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent aria-labelledby="clear-title" aria-describedby="clear-desc">
          <DialogHeader>
            <DialogTitle id="clear-title">Clear all data?</DialogTitle>
            <DialogDescription id="clear-desc">
              This will permanently remove all {subscriptions.length} subscriptions and your
              activity history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                clearAll();
                setConfirmOpen(false);
              }}
            >
              Yes, delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
