"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { restaurants as restaurantsApi } from "@/lib/api";
import type { Cuisine, PriceRange, OpeningHours, Table } from "@/types/restaurant";

const CUISINES: Cuisine[] = [
  "Italian", "French", "Japanese", "Chinese", "Indian", "Mexican",
  "American", "Mediterranean", "Thai", "Greek", "Spanish", "Lebanese",
  "Korean", "Vietnamese", "Turkish", "Moroccan", "Brazilian", "Seafood",
  "Vegetarian", "Vegan", "Steakhouse", "Fusion", "Other",
];

const PRICE_RANGES: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

const DAYS: OpeningHours["day"][] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const DEFAULT_HOURS: OpeningHours[] = DAYS.map((day) => ({
  day,
  open: "09:00",
  close: "22:00",
  isClosed: day === "sunday",
}));

interface FormState {
  name: string;
  description: string;
  cuisine: Cuisine[];
  priceRange: PriceRange;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  coverImage: string;
  isFeatured: boolean;
  tables: Table[];
  openingHours: OpeningHours[];
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[var(--radius-xl)] p-6 flex flex-col gap-4"
      style={{ background: "var(--color-canvas)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div>
        <h2 className="text-body-md-strong text-[var(--color-ink)]">{title}</h2>
        {subtitle && <p className="text-caption text-[var(--color-mute)] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function RestaurantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    cuisine: [],
    priceRange: "$$",
    street: "",
    city: "",
    state: "",
    country: "US",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    coverImage: "",
    isFeatured: false,
    tables: [{ label: "Standard", capacity: 4, count: 5 }],
    openingHours: DEFAULT_HOURS,
  });

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCuisine(c: Cuisine) {
    setForm((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(c)
        ? prev.cuisine.filter((x) => x !== c)
        : [...prev.cuisine, c],
    }));
  }

  function updateHours(day: OpeningHours["day"], patch: Partial<OpeningHours>) {
    setForm((prev) => ({
      ...prev,
      openingHours: prev.openingHours.map((h) =>
        h.day === day ? { ...h, ...patch } : h
      ),
    }));
  }

  function addTable() {
    setForm((prev) => ({
      ...prev,
      tables: [...prev.tables, { label: "", capacity: 2, count: 1 }],
    }));
  }

  function updateTable(idx: number, patch: Partial<Table>) {
    setForm((prev) => ({
      ...prev,
      tables: prev.tables.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
    }));
  }

  function removeTable(idx: number) {
    setForm((prev) => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== idx),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.cuisine.length === 0) {
      setError("Select at least one cuisine type.");
      return;
    }
    setLoading(true);
    try {
      const { restaurant } = await restaurantsApi.create({
        name: form.name,
        description: form.description || undefined,
        cuisine: form.cuisine,
        priceRange: form.priceRange,
        address: {
          street: form.street || undefined,
          city: form.city,
          state: form.state || undefined,
          country: form.country,
          zipCode: form.zipCode || undefined,
        },
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        coverImage: form.coverImage || null,
        isFeatured: form.isFeatured,
        tables: form.tables,
        openingHours: form.openingHours,
      });
      router.push(`/restaurants/${restaurant._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create restaurant.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* ── Basic info ─────────────────────────────────── */}
      <SectionCard title="Basic information">
        <Input
          label="Restaurant name *"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          required
          placeholder="e.g. Maison Dorée"
        />
        <div className="flex flex-col gap-1">
          <label className="text-body-sm-strong text-[var(--color-ink)]">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            maxLength={3000}
            placeholder="Tell guests what makes this restaurant special…"
            className="w-full text-body-md text-[var(--color-ink)] bg-[var(--color-canvas)] border border-[var(--color-ink)] rounded-[var(--radius-md)] px-[var(--spacing-lg)] py-[var(--spacing-md)] placeholder:text-[var(--color-mute)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
          />
          <p className="text-caption text-[var(--color-mute)] self-end">{form.description.length}/3000</p>
        </div>
      </SectionCard>

      {/* ── Cuisine ────────────────────────────────────── */}
      <SectionCard title="Cuisine types *" subtitle="Select all that apply.">
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => {
            const selected = form.cuisine.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className="px-3 py-1.5 rounded-[var(--radius-xl)] text-body-sm transition-colors cursor-pointer"
                style={{
                  background: selected ? "var(--color-primary)" : "var(--color-canvas-soft)",
                  color: selected ? "var(--color-on-primary)" : "var(--color-body)",
                  border: `1px solid ${selected ? "transparent" : "var(--color-canvas-soft)"}`,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Pricing & media ────────────────────────────── */}
      <SectionCard title="Pricing & media">
        <div>
          <p className="text-body-sm-strong text-[var(--color-ink)] mb-2">Price range *</p>
          <div className="flex gap-2">
            {PRICE_RANGES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setField("priceRange", p)}
                className="w-14 py-2 rounded-[var(--radius-xl)] text-body-sm font-semibold transition-colors cursor-pointer"
                style={{
                  background: form.priceRange === p ? "var(--color-primary)" : "var(--color-canvas-soft)",
                  color: form.priceRange === p ? "var(--color-on-primary)" : "var(--color-body)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Cover image URL"
          type="url"
          value={form.coverImage}
          onChange={(e) => setField("coverImage", e.target.value)}
          placeholder="https://images.unsplash.com/…"
        />

        {form.coverImage && (
          <div className="w-full h-40 rounded-[var(--radius-lg)] overflow-hidden">
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setField("isFeatured", e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: "var(--color-primary)" }}
          />
          <span className="text-body-sm text-[var(--color-ink)]">Mark as featured restaurant</span>
        </label>
      </SectionCard>

      {/* ── Location ───────────────────────────────────── */}
      <SectionCard title="Location">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Street address"
              value={form.street}
              onChange={(e) => setField("street", e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <Input
            label="City *"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            required
            placeholder="Paris"
          />
          <Input
            label="State / Region"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            placeholder="Île-de-France"
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            placeholder="US"
          />
          <Input
            label="ZIP / Postal code"
            value={form.zipCode}
            onChange={(e) => setField("zipCode", e.target.value)}
            placeholder="75001"
          />
        </div>
      </SectionCard>

      {/* ── Contact ────────────────────────────────────── */}
      <SectionCard title="Contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+1 555 000 0000"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="contact@restaurant.com"
          />
          <div className="sm:col-span-2">
            <Input
              label="Website"
              type="url"
              value={form.website}
              onChange={(e) => setField("website", e.target.value)}
              placeholder="https://restaurant.com"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Tables ─────────────────────────────────────── */}
      <SectionCard title="Tables" subtitle="Define the seating configurations available.">
        <div className="flex flex-col gap-3">
          {form.tables.map((t, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[1fr_140px_140px_auto] items-end gap-3 p-4 rounded-[var(--radius-lg)]"
              style={{ background: "var(--color-canvas-soft)" }}
            >
              <Input
                label="Label"
                value={t.label ?? ""}
                onChange={(e) => updateTable(idx, { label: e.target.value })}
                placeholder="Standard / VIP…"
              />
              <Input
                label="Seats per table"
                type="number"
                min={1}
                max={20}
                value={t.capacity}
                onChange={(e) => updateTable(idx, { capacity: Math.max(1, parseInt(e.target.value) || 1) })}
              />
              <Input
                label="No. of tables"
                type="number"
                min={1}
                value={t.count}
                onChange={(e) => updateTable(idx, { count: Math.max(1, parseInt(e.target.value) || 1) })}
              />
              {form.tables.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTable(idx)}
                  className="text-body-sm cursor-pointer pb-2 whitespace-nowrap hover:underline"
                  style={{ color: "var(--color-negative)" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={addTable} className="self-start">
          + Add table type
        </Button>
      </SectionCard>

      {/* ── Opening hours ──────────────────────────────── */}
      <SectionCard title="Opening hours" subtitle="Check the days the restaurant is open.">
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-canvas-soft)" }}>
          {form.openingHours.map((h) => (
            <div
              key={h.day}
              className="flex items-center gap-4 py-3"
            >
              <label className="flex items-center gap-2 w-32 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!h.isClosed}
                  onChange={(e) => updateHours(h.day, { isClosed: !e.target.checked })}
                  className="w-4 h-4"
                  style={{ accentColor: "var(--color-primary)" }}
                />
                <span className="text-body-sm text-[var(--color-ink)] capitalize">{h.day}</span>
              </label>

              {h.isClosed ? (
                <span className="text-body-sm text-[var(--color-mute)]">Closed</span>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.open ?? "09:00"}
                    onChange={(e) => updateHours(h.day, { open: e.target.value })}
                    className="text-body-sm text-[var(--color-ink)] bg-[var(--color-canvas)] border rounded-[var(--radius-md)] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{ borderColor: "var(--color-canvas-soft)" }}
                  />
                  <span className="text-body-sm text-[var(--color-mute)]">to</span>
                  <input
                    type="time"
                    value={h.close ?? "22:00"}
                    onChange={(e) => updateHours(h.day, { close: e.target.value })}
                    className="text-body-sm text-[var(--color-ink)] bg-[var(--color-canvas)] border rounded-[var(--radius-md)] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{ borderColor: "var(--color-canvas-soft)" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Submit ─────────────────────────────────────── */}
      {error && (
        <p className="text-body-sm text-[var(--color-negative)] px-1">{error}</p>
      )}

      <div className="flex justify-end gap-3 pb-4">
        <Button type="button" variant="tertiary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating…" : "Create restaurant"}
        </Button>
      </div>
    </form>
  );
}
