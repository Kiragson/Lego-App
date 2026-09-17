"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

const SET_TYPES = [
  {
    value: "STANDARD",
    label: "Standard",
  },
  {
    value: "MINIFIG",
    label: "Minifigure",
  },
  {
    value: "MOC",
    label: "MOC",
  },
];

export default function NewSetPage() {
  const [setNumber, setSetNumber] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("STANDARD");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
  event: any,
) {
  console.log("SAVE SET CLICKED");
  event.preventDefault();

  setSaving(true);

  try {
    const response = await fetch("/api/catalog/sets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        setNumber,
        name,
        type,
        description,
        imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create set");
    }

    window.location.href = "/catalog/sets";
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to create set",
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/catalog/sets"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
          aria-label="Back to sets"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add LEGO Set
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new set definition to the LEGO catalog.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="font-medium">Basic information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Information identifying this LEGO set.
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Set number */}
            <div className="space-y-2">
              <label
                htmlFor="setNumber"
                className="text-sm font-medium"
              >
                Set number
              </label>

              <input
                id="setNumber"
                name="setNumber"
                type="text"
                value={setNumber}
                onChange={(event) => setSetNumber(event.target.value)}
                placeholder="e.g. 75375"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />

              <p className="text-xs text-muted-foreground">
                LEGO set number, for example 75375.
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Millennium Falcon"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium"
              >
                Set type
              </label>

              <select
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {SET_TYPES.map((setType) => (
                  <option
                    key={setType.value}
                    value={setType.value}
                  >
                    {setType.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Optional description..."
                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label
                htmlFor="imageUrl"
                className="text-sm font-medium"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https://..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />

              <p className="text-xs text-muted-foreground">
                Optional. Image upload can be added later.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/catalog/sets"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {saving ? "Saving..." : "Save set"}
          </button>
        </div>
      </form>
    </div>
  );
}