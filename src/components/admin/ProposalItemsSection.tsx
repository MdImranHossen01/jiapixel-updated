"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Link as LinkIcon, FolderKanban, Search, X } from "lucide-react";

export interface OfferItemInput {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  link?: string;
}

interface ProposalItemsSectionProps {
  items: OfferItemInput[];
  setItems: React.Dispatch<React.SetStateAction<OfferItemInput[]>>;
  serviceCharge: number;
  setServiceCharge: (v: number) => void;
  discountType: "fixed" | "percentage";
  setDiscountType: (v: "fixed" | "percentage") => void;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  currency: string;
  projects: any[];
  required?: boolean;
}

export default function ProposalItemsSection({
  items,
  setItems,
  serviceCharge,
  setServiceCharge,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  currency,
  projects,
  required = true,
}: ProposalItemsSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [openLinkIdx, setOpenLinkIdx] = useState<number | null>(null);

  const currSym = currency === "USD" ? "$" : "৳";

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );
  const discountAmount =
    discountType === "percentage"
      ? Math.round(((subtotal + serviceCharge) * Number(discountValue || 0)) / 100)
      : Number(discountValue || 0);
  const total = Math.max(0, subtotal + Number(serviceCharge || 0) - discountAmount);

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", quantity: 1, price: 0, link: "" }]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof OfferItemInput, val: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const addProjectAsItem = (p: any) => {
    const projectUrl = p.liveLink || (p.slug ? `${window.location.origin}/projects/${p.slug}` : "");
    const priceVal = Number(p.price || p.estimatePrice || 0);
    setItems((prev) => {
      if (prev.length === 1 && !prev[0].name.trim() && Number(prev[0].price) === 0) {
        return [{ name: p.title || p.name || "", quantity: 1, price: priceVal, link: projectUrl }];
      }
      return [...prev, { name: p.title || p.name || "", quantity: 1, price: priceVal, link: projectUrl }];
    });
  };

  const filteredProjects = projects.filter((p) =>
    (p.title || p.name || "").toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Services / Items {required ? <span className="text-red-500">*</span> : <span className="text-xs font-normal text-muted-foreground">(Optional)</span>}
          </h3>
          <p className="text-xs text-muted-foreground">
            Add one or multiple services/items for this offer
          </p>
        </div>
        <div className="flex items-center gap-2">
          {projects.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen((o) => !o)}
              className="gap-1.5"
            >
              <FolderKanban className="w-4 h-4 text-primary" />
              Pick from Projects
            </Button>
          )}
          <Button type="button" size="sm" onClick={addItem} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {pickerOpen && (
        <div className="p-3 border border-border rounded-lg bg-muted/30 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setPickerOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {filteredProjects.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => addProjectAsItem(p)}
                className="text-left px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-xs flex justify-between items-center transition-colors"
              >
                <span className="font-medium truncate">{p.title || p.name}</span>
                <span className="text-primary font-semibold ml-2 shrink-0">+ Add</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-border bg-muted/20 space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5 space-y-1">
                <Label className="text-xs text-muted-foreground">Service / Item Name *</Label>
                <Input
                  placeholder="e.g., E-Commerce Website Development"
                  value={item.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Unit Price ({currSym})</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) => updateItem(idx, "price", Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Line Total</Label>
                <div className="h-9 px-3 rounded-md border border-border bg-background flex items-center font-semibold text-sm">
                  {currSym}
                  {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                </div>
              </div>
              <div className="md:col-span-1 flex items-center justify-end gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  title="Add reference link"
                  onClick={() => setOpenLinkIdx(openLinkIdx === idx ? null : idx)}
                >
                  <LinkIcon className={`w-4 h-4 ${item.link ? "text-primary" : "text-muted-foreground"}`} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={items.length <= 1}
                  onClick={() => removeItem(idx)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {openLinkIdx === idx && (
              <div className="pt-1">
                <Input
                  placeholder="Optional reference link (https://...)"
                  value={item.link || ""}
                  onChange={(e) => updateItem(idx, "link", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Service Charge ({currSym})</Label>
          <Input
            type="number"
            min={0}
            value={serviceCharge}
            onChange={(e) => setServiceCharge(Math.max(0, Number(e.target.value)))}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Discount</Label>
          <div className="flex gap-2">
            <Select
              value={discountType}
              onValueChange={(v: "fixed" | "percentage") => setDiscountType(v)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">{currSym} Fixed</SelectItem>
                <SelectItem value="percentage">% Pct</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              value={discountValue}
              onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex flex-col justify-center">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal:</span>
            <span>
              {currSym}
              {subtotal.toLocaleString()}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-red-500">
              <span>Discount:</span>
              <span>
                -{currSym}
                {discountAmount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-primary mt-1 pt-1 border-t border-primary/20">
            <span>Total Estimate:</span>
            <span>
              {currSym}
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

