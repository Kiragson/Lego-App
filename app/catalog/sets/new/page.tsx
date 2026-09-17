"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

export default function NewSetPage() {
  const [rebrickableSetNum, setRebrickableSetNum] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [numParts, setNumParts] = useState("");
  const [themeId, setThemeId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/catalog/sets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rebrickableSetNum: rebrickableSetNum.trim(),
          name: name.trim(),
          year: Number(year),
          numParts: numParts ? Number(numParts) : null,
          themeId: themeId.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się utworzyć zestawu.");
      }

      window.location.href = `/catalog/sets/${data.id}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił nieznany błąd."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href="/catalog/sets"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sets
          </Link>

          <div className="mt-4">
            <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
              Katalog
            </span>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              Add LEGO set
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Dodaj zestaw do katalogu.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="rebrickableSetNum"
                className="block text-sm font-semibold text-zinc-800"
              >
                Rebrickable set number
              </label>

              <input
                id="rebrickableSetNum"
                value={rebrickableSetNum}
                onChange={(event) =>
                  setRebrickableSetNum(event.target.value)
                }
                required
                placeholder="np. 10281-1"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-zinc-800"
              >
                Name
              </label>

              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="np. Bonsai Tree"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-semibold text-zinc-800"
              >
                Year
              </label>

              <input
                id="year"
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                required
                min="1900"
                max="2100"
                placeholder="2021"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="numParts"
                className="block text-sm font-semibold text-zinc-800"
              >
                Number of parts
              </label>

              <input
                id="numParts"
                type="number"
                value={numParts}
                onChange={(event) => setNumParts(event.target.value)}
                min="0"
                placeholder="878"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="themeId"
                className="block text-sm font-semibold text-zinc-800"
              >
                Theme ID
              </label>

              <input
                id="themeId"
                value={themeId}
                onChange={(event) => setThemeId(event.target.value)}
                placeholder="UUID motywu — opcjonalne"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />

              <p className="mt-2 text-xs text-zinc-400">
                Na tym etapie podajemy UUID motywu bezpośrednio. Później
                zastąpimy to wyborem z listy Theme.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/catalog/sets"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save set"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}