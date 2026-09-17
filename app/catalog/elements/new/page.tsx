"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ELEMENT_TYPES = [
  { value: "PART", label: "Part" },
  { value: "MINIFIG", label: "Minifigure" },
  { value: "BOOK", label: "Book" },
  { value: "STICKER", label: "Sticker" },
  { value: "BOX", label: "Box" },
  { value: "OTHER", label: "Other" },
];

type Category = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  namePl?: string | null;
  legoColorId?: number | null;
  hexCode?: string | null;
};

export default function NewElementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const [elementNumber, setElementNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [name, setName] = useState("");
  const [elementType, setElementType] = useState("PART");
  const [categoryId, setCategoryId] = useState("");
  const [colorId, setColorId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalogData() {
      try {
        const [categoriesResponse, colorsResponse] = await Promise.all([
          fetch("/api/catalog/category"),
          fetch("/api/catalog/colors"),
        ]);

        if (!categoriesResponse.ok) {
          throw new Error("Failed to load categories.");
        }

        if (!colorsResponse.ok) {
          throw new Error("Failed to load colors.");
        }

        const categoriesData = await categoriesResponse.json();
        const colorsData = await colorsResponse.json();

        setCategories(categoriesData);
        setColors(colorsData);
      } catch (err) {
        console.error(err);
        setError("Nie udało się załadować kategorii i kolorów.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalogData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/catalog/elements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elementNumber,
          partNumber,
          name,
          elementType,
          categoryId: categoryId || null,
          colorId: colorId || null,
          imageUrl: imageUrl || null,
          description: description || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create element.");
      }

      window.location.href = "/catalog/elements";
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się utworzyć elementu.",
      );

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          Ładowanie katalogu...
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
            Add Element
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Dodaj konkretny wariant elementu LEGO do katalogu.
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
                value={elementNumber}
                onChange={(event) =>
                  setElementNumber(event.target.value)
                }
                placeholder="np. 3001"
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Part Number
              </label>

              <input
                type="text"
                value={partNumber}
                onChange={(event) =>
                  setPartNumber(event.target.value)
                }
                placeholder="np. 3001"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                Numer katalogowy części LEGO, jeśli różni się od
                element number.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="np. Brick 2 x 4"
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>

              <select
                value={elementType}
                onChange={(event) =>
                  setElementType(event.target.value)
                }
                required
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                {ELEMENT_TYPES.map((elementTypeOption) => (
                  <option
                    key={elementTypeOption.value}
                    value={elementTypeOption.value}
                  >
                    {elementTypeOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                <option value="">No category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  Brak kategorii. Możesz dodać kategorię później.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Color
              </label>

              <select
                value={colorId}
                onChange={(event) => setColorId(event.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              >
                <option value="">No color</option>

                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                    {color.namePl ? ` — ${color.namePl}` : ""}
                  </option>
                ))}
              </select>

              {colors.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  Brak kolorów w katalogu.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
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
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Opcjonalny opis elementu..."
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
              {saving ? "Saving..." : "Create Element"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}