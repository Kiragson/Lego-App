"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ELEMENT_TYPES = [
  { value: "BRICK", label: "Brick" },
  { value: "PLATE", label: "Plate" },
  { value: "TILE", label: "Tile" },
  { value: "SLOPE", label: "Slope" },
  { value: "TECHNIC", label: "Technic" },
  { value: "MINIFIG_HEAD", label: "Minifigure Head" },
  { value: "MINIFIG_TORSO", label: "Minifigure Torso" },
  { value: "MINIFIG_LEGS", label: "Minifigure Legs" },
  { value: "MINIFIG_HAIR", label: "Minifigure Hair" },
  { value: "MINIFIG_ACCESSORY", label: "Minifigure Accessory" },
  { value: "ANIMAL", label: "Animal" },
  { value: "OTHER", label: "Other" },
];

type Part = {
  id: string;
  partNumber: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  namePl: string | null;
};

type Element = {
  id: string;
  legoElementNumber: string;
  partId: string | null;
  name: string;
  type: string;
  colorId: string | null;
  imageUrl: string | null;
  description: string | null;
};

export default function EditElementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [elementId, setElementId] = useState("");

  const [parts, setParts] = useState<Part[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const [legoElementNumber, setLegoElementNumber] = useState("");
  const [partId, setPartId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("OTHER");
  const [colorId, setColorId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const { id } = await params;
        setElementId(id);

        const [elementResponse, partsResponse, colorsResponse] =
          await Promise.all([
            fetch(`/api/catalog/elements/${id}`),
            fetch("/api/catalog/parts"),
            fetch("/api/catalog/colors"),
          ]);

        if (!elementResponse.ok) {
          throw new Error("Nie udało się pobrać elementu.");
        }

        if (!partsResponse.ok) {
          throw new Error("Nie udało się pobrać Parts.");
        }

        if (!colorsResponse.ok) {
          throw new Error("Nie udało się pobrać Colors.");
        }

        const element: Element = await elementResponse.json();
        const partsData: Part[] = await partsResponse.json();
        const colorsData: Color[] = await colorsResponse.json();

        setLegoElementNumber(element.legoElementNumber);
        setPartId(element.partId || "");
        setName(element.name);
        setType(element.type);
        setColorId(element.colorId || "");
        setImageUrl(element.imageUrl || "");
        setDescription(element.description || "");

        setParts(partsData);
        setColors(colorsData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Nie udało się załadować elementu.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  async function handleSubmit(event: any) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/catalog/elements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: elementId,
          legoElementNumber,
          partId,
          name,
          type,
          colorId,
          imageUrl,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się zaktualizować elementu.");
      }

      window.location.href = "/catalog/elements";
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować elementu.",
      );
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          Ładowanie elementu...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/catalog/elements"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to Elements
          </Link>

          <h1 className="mt-3 text-2xl font-semibold text-gray-900">
            Edit Element
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Edytuj wariant elementu LEGO.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                LEGO Element Number
              </label>

              <input
                type="text"
                value={legoElementNumber}
                onChange={(event) =>
                  setLegoElementNumber(event.target.value)
                }
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Part
              </label>

              <select
                value={partId}
                onChange={(event) => setPartId(event.target.value)}
                required
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                <option value="">Select part...</option>

                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.partNumber} — {part.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                required
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                {ELEMENT_TYPES.map((elementType) => (
                  <option key={elementType.value} value={elementType.value}>
                    {elementType.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Color
              </label>

              <select
                value={colorId}
                onChange={(event) => setColorId(event.target.value)}
                required
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                <option value="">Select color...</option>

                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                    {color.namePl ? ` — ${color.namePl}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Link
              href="/catalog/elements"
              className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}