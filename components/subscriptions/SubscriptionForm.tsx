"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CATEGORIES, BILLING_CYCLES, STATUSES, CURRENCIES } from "@/lib/constants";
import type { Subscription } from "@/lib/types";
import { currencySymbol } from "@/lib/utils";

export type SubscriptionDraft = Omit<Subscription, "id">;

interface Props {
  initial?: Subscription;
  defaultCurrency?: string;
  onSubmit: (draft: SubscriptionDraft) => void;
  onCancel?: () => void;
  formId?: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nextMonthISO() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export function SubscriptionForm({
  initial,
  defaultCurrency = "USD",
  onSubmit,
  onCancel,
  formId = "subscription-form",
}: Props) {
  const [values, setValues] = React.useState<SubscriptionDraft>(() => ({
    name: initial?.name ?? "",
    logo: initial?.logo ?? "",
    category: initial?.category ?? "SaaS",
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? defaultCurrency,
    billingCycle: initial?.billingCycle ?? "Monthly",
    nextRenewalDate: initial?.nextRenewalDate ?? nextMonthISO(),
    startDate: initial?.startDate ?? todayISO(),
    notes: initial?.notes ?? "",
    status: initial?.status ?? "Active",
    url: initial?.url ?? "",
  }));

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function set<K extends keyof SubscriptionDraft>(key: K, value: SubscriptionDraft[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!(values.amount > 0)) next.amount = "Enter an amount greater than 0.";
    if (!values.nextRenewalDate) next.nextRenewalDate = "Renewal date is required.";
    if (!values.startDate) next.startDate = "Start date is required.";
    if (values.url && !/^https?:\/\//i.test(values.url))
      next.url = "URL must start with http:// or https://";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      logo: values.logo?.trim() || undefined,
      url: values.url?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    });
  }

  const fieldErr = (id: string) =>
    errors[id] ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        id={`${id}-error`}
        role="alert"
        className="text-xs text-destructive"
      >
        {errors[id]}
      </motion.p>
    ) : null;

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Netflix"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoFocus
        />
        {fieldErr("name")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={values.category} onValueChange={(v) => set("category", v as any)}>
            <SelectTrigger id="category" aria-label="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as any)}>
            <SelectTrigger id="status" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currencySymbol(values.currency)}
            </span>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className="pl-7"
              value={values.amount || ""}
              onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
              aria-required="true"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
          </div>
          {fieldErr("amount")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Select value={values.currency} onValueChange={(v) => set("currency", v)}>
            <SelectTrigger id="currency" aria-label="Currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="billingCycle">Billing cycle</Label>
        <Select
          value={values.billingCycle}
          onValueChange={(v) => set("billingCycle", v as any)}
        >
          <SelectTrigger id="billingCycle" aria-label="Billing cycle">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BILLING_CYCLES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
          />
          {fieldErr("startDate")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nextRenewalDate">Next renewal</Label>
          <Input
            id="nextRenewalDate"
            type="date"
            value={values.nextRenewalDate}
            onChange={(e) => set("nextRenewalDate", e.target.value)}
            aria-invalid={!!errors.nextRenewalDate}
            aria-describedby={
              errors.nextRenewalDate ? "nextRenewalDate-error" : undefined
            }
          />
          {fieldErr("nextRenewalDate")}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">Manage URL (optional)</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://..."
          value={values.url}
          onChange={(e) => set("url", e.target.value)}
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? "url-error" : undefined}
        />
        {fieldErr("url")}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          rows={2}
          placeholder="Anything worth remembering…"
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{initial ? "Save changes" : "Add subscription"}</Button>
      </div>
    </form>
  );
}
