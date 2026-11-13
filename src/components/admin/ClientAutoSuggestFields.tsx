"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface ClientSuggestion {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessName?: string;
}

interface ClientAutoSuggestFieldsProps {
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  clientPhone: string;
  setClientPhone: (v: string) => void;
  clientAddress: string;
  setClientAddress: (v: string) => void;
  businessName: string;
  setBusinessName: (v: string) => void;
  suggestions: ClientSuggestion[];
  emailRequired?: boolean;
  required?: boolean;
}

export default function ClientAutoSuggestFields({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  clientAddress,
  setClientAddress,
  businessName,
  setBusinessName,
  suggestions,
  emailRequired = true,
  required = true,
}: ClientAutoSuggestFieldsProps) {
  const [activeSuggestions, setActiveSuggestions] = useState<ClientSuggestion[]>([]);
  const [showFor, setShowFor] = useState<"name" | "email" | "phone" | null>(null);

  const filterBy = (field: "name" | "email" | "phone", val: string) => {
    if (!val.trim()) {
      setActiveSuggestions([]);
      setShowFor(null);
      return;
    }
    const q = val.toLowerCase();
    const filtered = suggestions.filter((s) => {
      if (field === "name") return (s.name || "").toLowerCase().includes(q);
      if (field === "email") return (s.email || "").toLowerCase().includes(q);
      return (s.phone || "").includes(val);
    });
    setActiveSuggestions(filtered.slice(0, 8));
    setShowFor(field);
  };

  const selectSuggestion = (s: ClientSuggestion) => {
    setClientName(s.name || "");
    setClientEmail(s.email || "");
    setClientPhone(s.phone || "");
    setClientAddress(s.address || "");
    setBusinessName(s.businessName || "");
    setActiveSuggestions([]);
    setShowFor(null);
  };

  const renderDropdown = (field: "name" | "email" | "phone") => {
    if (showFor !== field || activeSuggestions.length === 0) return null;
    return (
      <div className="absolute z-50 w-full bg-popover border border-border rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
        {activeSuggestions.map((s, idx) => (
          <div
            key={idx}
            onClick={() => selectSuggestion(s)}
            className="p-2.5 hover:bg-accent cursor-pointer border-b last:border-0 text-xs transition-colors"
          >
            <div className="font-bold text-foreground">
              {s.name || "Unnamed"}{" "}
              {s.businessName ? (
                <span className="text-primary font-normal">({s.businessName})</span>
              ) : null}
            </div>
            <div className="text-muted-foreground">
              {s.email || "No email"} {s.phone ? `• ${s.phone}` : ""}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
      <div className="space-y-2 relative">
        <Label className="flex items-center gap-1.5 font-semibold">
          <User className="w-4 h-4 text-primary" /> Client Name {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          placeholder="e.g. Md. Rakibul Islam"
          value={clientName}
          onChange={(e) => {
            setClientName(e.target.value);
            filterBy("name", e.target.value);
          }}
          onBlur={() => setTimeout(() => setShowFor(null), 200)}
          autoComplete="off"
          required={required}
        />
        {renderDropdown("name")}
      </div>

      <div className="space-y-2 relative">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Mail className="w-4 h-4 text-primary" /> Client Email{" "}
          {required && emailRequired && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="email"
          placeholder="client@example.com"
          value={clientEmail}
          onChange={(e) => {
            setClientEmail(e.target.value);
            filterBy("email", e.target.value);
          }}
          onBlur={() => setTimeout(() => setShowFor(null), 200)}
          autoComplete="off"
          required={required && emailRequired}
        />
        {renderDropdown("email")}
      </div>

      <div className="space-y-2 relative">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Phone className="w-4 h-4 text-primary" /> WhatsApp / Phone{" "}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          placeholder="e.g. 017xxxxxxxx"
          value={clientPhone}
          onChange={(e) => {
            setClientPhone(e.target.value);
            filterBy("phone", e.target.value);
          }}
          onBlur={() => setTimeout(() => setShowFor(null), 200)}
          autoComplete="off"
          required={required}
        />
        {renderDropdown("phone")}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Briefcase className="w-4 h-4 text-primary" /> Business Name (Optional)
        </Label>
        <Input
          placeholder="e.g. ABC Trading"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label className="flex items-center gap-1.5 font-semibold">
          <MapPin className="w-4 h-4 text-primary" /> Client Address{" "}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          placeholder="House, Road, Area, City"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          required={required}
        />
      </div>
    </div>
  );
}

