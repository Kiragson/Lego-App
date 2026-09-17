"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Theme = {
  id: string;
  rebrickableId: number;
  name: string;
};

export default function NewThemePage() {
  const router = useRouter();

  const [themes, setThemes] = useState<Theme[]>([]);
  const [rebrickableId, setRebrickableId] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(true);

  useEffect(() => {
    async function loadThemes() {
      try {
        const response = await fetch("/api/catalog/themes", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać themes.");
        }

        const data: Theme[] = await response.json();

        setThemes(data);
      } catch (error) {
        console.error("Load themes error:", error);
        setError("Nie udało się pobrać listy themes.");
      } finally {
        setLoadingThemes(false);
      }
    }

    loadThemes();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const parsedRebrickableId = Number(rebrickableId);

    if (!Number.isInteger(parsedRebrickableId)) {
      setError("Rebrickable ID musi być liczbą całkowitą.");
      return;
    }

    if (!name.trim()) {
      setError("Nazwa theme jest wymagana.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/catalog/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rebrickableId: parsedRebrickableId,
          name: name.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Nie udało się utworzyć theme.");
        return;
      }

      router.push("/catalog/themes");
      router.refresh();
    } catch (error) {
      console.error("Create theme error:", error);
      setError("Wystąpił błąd połączenia z serwerem.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => router.push("/catalog/themes")}
        >
          ← Wróć do Themes
        </button>
      </div>

      <h1>Dodaj Theme</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 500,
          marginTop: 24,
        }}
      >
        <label>
          Rebrickable ID
          <input
            type="number"
            value={rebrickableId}
            onChange={(event) => setRebrickableId(event.target.value)}
            required
            min="0"
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
            }}
          />
        </label>

        <label>
          Nazwa
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
            }}
          />
        </label>

        <label>
          Parent Theme
          <select
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            disabled={loadingThemes}
            style={{
              display: "block",
              width: "100%",
              marginTop: 4,
            }}
          >
            <option value="">
              {loadingThemes
                ? "Ładowanie..."
                : "Brak parenta"}
            </option>

            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name} ({theme.rebrickableId})
              </option>
            ))}
          </select>
        </label>

        {parentId && (
          <small>
            Wybrany parent ID: {parentId}
          </small>
        )}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={saving || loadingThemes}>
          {saving ? "Zapisywanie..." : "Dodaj Theme"}
        </button>
      </form>
    </main>
  );
}