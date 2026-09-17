"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Palette,
  Plus,
  Search,
  X,
} from "lucide-react";
import DeleteColorButton from "./DeleteColorButton";

type Color = {
  id: string;
  name: string;
  rgb: string | null;
  hex: string | null;
  _count: {
    elements: number;
  };
};

type SortOption =
  | "name-asc"
  | "name-desc";

export default function CatalogColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] =
    useState<SortOption>("name-asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CREATE
  // =========================================================

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newName, setNewName] = useState("");
  const [newRgb, setNewRgb] = useState("");
  const [newHex, setNewHex] = useState("");

  // =========================================================
  // EDIT
  // =========================================================

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const [editingColorId, setEditingColorId] =
    useState("");
  const [editingName, setEditingName] =
    useState("");
  const [editingRgb, setEditingRgb] =
    useState("");
  const [editingHex, setEditingHex] =
    useState("");

  // =========================================================
  // LOAD COLORS
  // =========================================================

  useEffect(() => {
    async function loadColors() {
      try {
        const response = await fetch(
          "/api/catalog/colors",
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load colors.",
          );
        }

        setColors(data);
      } catch (error) {
        console.error(error);
        setError(
          "Nie udało się załadować kolorów.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadColors();
  }, []);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredColors = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = colors.filter((color) => {
      if (!query) {
        return true;
      }

      return (
        color.name
          .toLowerCase()
          .includes(query) ||
        color.rgb
          ?.toLowerCase()
          .includes(query) ||
        color.hex
          ?.toLowerCase()
          .includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [colors, search, sort]);

  const hasActiveFilters =
    search.trim() !== "" ||
    sort !== "name-asc";

  function clearFilters() {
    setSearch("");
    setSort("name-asc");
  }

  // =========================================================
  // CREATE
  // =========================================================

  function openCreateDialog() {
    setNewName("");
    setNewRgb("");
    setNewHex("");
    setCreateError("");
    setCreateOpen(true);
  }

  function closeCreateDialog() {
    if (creating) {
      return;
    }

    setCreateOpen(false);
    setCreateError("");
  }

  async function handleCreateColor(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!newName.trim()) {
      setCreateError(
        "Color name is required.",
      );
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const response = await fetch(
        "/api/catalog/colors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName.trim(),
            rgb: newRgb.trim() || null,
            hex: newHex.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setCreateError(
          data.error ||
            "Failed to create color.",
        );
        return;
      }

      const newColor: Color = {
        ...data,
        _count: {
          elements: 0,
        },
      };

      setColors((current) => [
        newColor,
        ...current,
      ]);

      closeCreateDialog();
    } catch (error) {
      console.error(error);
      setCreateError(
        "Something went wrong.",
      );
    } finally {
      setCreating(false);
    }
  }

  // =========================================================
  // EDIT
  // =========================================================

  function openEditDialog(color: Color) {
    setEditingColorId(color.id);
    setEditingName(color.name);
    setEditingRgb(color.rgb || "");
    setEditingHex(color.hex || "");
    setEditError("");
    setEditOpen(true);
  }

  function closeEditDialog() {
    if (editing) {
      return;
    }

    setEditOpen(false);
    setEditingColorId("");
    setEditError("");
  }

  async function handleEditColor(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingName.trim()) {
      setEditError(
        "Color name is required.",
      );
      return;
    }

    if (!editingColorId) {
      setEditError(
        "Color ID is missing.",
      );
      return;
    }

    setEditing(true);
    setEditError("");

    try {
      const response = await fetch(
        "/api/catalog/colors",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingColorId,
            name: editingName.trim(),
            rgb: editingRgb.trim() || null,
            hex: editingHex.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setEditError(
          data.error ||
            "Failed to update color.",
        );
        return;
      }

      setColors((current) =>
        current.map((color) =>
          color.id === editingColorId
            ? {
                ...data,
                _count:
                  color._count,
              }
            : color,
        ),
      );

      closeEditDialog();
    } catch (error) {
      console.error(error);
      setEditError(
        "Something went wrong.",
      );
    } finally {
      setEditing(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading colors...
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">
        {/* HEADER */}
        <div className="border-b pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                <Palette className="h-7 w-7 text-primary" />
                LEGO Colors
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage colors used by LEGO
                elements.
              </p>
            </div>

            {/* DESKTOP ADD */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={openCreateDialog}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add color
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* FILTER BAR */}
        {colors.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* SEARCH */}
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search colors..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* SORT */}
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as SortOption,
                  )
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary sm:w-52"
              >
                <option value="name-asc">
                  Name: A–Z
                </option>

                <option value="name-desc">
                  Name: Z–A
                </option>
              </select>
            </div>

            {/* RESULTS */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredColors.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {colors.length}
                </span>{" "}
                colors
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* EMPTY */}
        {colors.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Palette className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              No colors yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Get started by adding your
              first LEGO color.
            </p>

            <button
              type="button"
              onClick={openCreateDialog}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add your first color
            </button>
          </div>
        ) : filteredColors.length === 0 ? (
          /* NO RESULTS */
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              No colors found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No color matches the current
              search.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* COLOR CARDS */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredColors.map((color) => (
              <div
                key={color.id}
                className="group flex min-h-[300px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* COLOR PREVIEW */}
                <div
                  className="relative flex h-40 items-center justify-center border-b"
                  style={{
                    backgroundColor:
                      color.hex || "#808080",
                  }}
                >
                  <div className="absolute inset-0 bg-white/5" />

                  <div className="relative rounded-full border-4 border-white/70 bg-background/20 p-4 shadow-lg backdrop-blur-sm">
                    <Palette className="h-8 w-8 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-4">
                  <div>
                    <h2
                      className="truncate font-semibold text-foreground"
                      title={color.name}
                    >
                      {color.name}
                    </h2>
                  </div>

                  {/* HEX */}
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">
                      HEX
                    </span>

                    <span className="font-mono font-medium text-foreground">
                      {color.hex || "—"}
                    </span>
                  </div>

                  {/* RGB */}
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">
                      RGB
                    </span>

                    <span className="font-mono font-medium text-foreground">
                      {color.rgb || "—"}
                    </span>
                  </div>

                  {/* ELEMENT COUNT */}
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Used by
                    </span>

                    <span className="font-medium text-foreground">
                      {color._count.elements}{" "}
                      {color._count.elements === 1
                        ? "element"
                        : "elements"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-auto flex items-center justify-end gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        openEditDialog(color)
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <DeleteColorButton
                      id={color.id}
                      name={color.name}
                      elementCount={
                        color._count.elements
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          FLOATING ADD BUTTON
          ===================================================== */}

      <button
        type="button"
        onClick={openCreateDialog}
        aria-label="Add color"
        title="Add color"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:bottom-8 sm:right-8"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* =====================================================
          CREATE DIALOG
          ===================================================== */}

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreateDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-color-title"
            className="my-8 w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-color-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Add Color
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a new LEGO color to your
                  catalog.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateDialog}
                disabled={creating}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreateColor}
              className="mt-6 space-y-5"
            >
              <FormField
                label="Name"
                htmlFor="new-color-name"
              >
                <input
                  id="new-color-name"
                  value={newName}
                  onChange={(event) =>
                    setNewName(
                      event.target.value,
                    )
                  }
                  placeholder="Black"
                  required
                  disabled={creating}
                  className="input"
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="RGB"
                  htmlFor="new-color-rgb"
                >
                  <input
                    id="new-color-rgb"
                    value={newRgb}
                    onChange={(event) =>
                      setNewRgb(
                        event.target.value,
                      )
                    }
                    placeholder="5, 19, 29"
                    disabled={creating}
                    className="input"
                  />
                </FormField>

                <FormField
                  label="HEX"
                  htmlFor="new-color-hex"
                >
                  <div className="flex gap-2">
                    <input
                      id="new-color-hex"
                      value={newHex}
                      onChange={(event) =>
                        setNewHex(
                          event.target.value,
                        )
                      }
                      placeholder="#05131D"
                      disabled={creating}
                      className="input"
                    />

                    <div
                      className="h-10 w-10 shrink-0 rounded-md border"
                      style={{
                        backgroundColor:
                          newHex || "#ffffff",
                      }}
                    />
                  </div>
                </FormField>
              </div>

              {createError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {createError}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeCreateDialog}
                  disabled={creating}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Color"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT DIALOG
          ===================================================== */}

      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-color-title"
            className="my-8 w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-color-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Edit Color
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the LEGO color.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditDialog}
                disabled={editing}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleEditColor}
              className="mt-6 space-y-5"
            >
              <FormField
                label="Name"
                htmlFor="edit-color-name"
              >
                <input
                  id="edit-color-name"
                  value={editingName}
                  onChange={(event) =>
                    setEditingName(
                      event.target.value,
                    )
                  }
                  required
                  disabled={editing}
                  className="input"
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="RGB"
                  htmlFor="edit-color-rgb"
                >
                  <input
                    id="edit-color-rgb"
                    value={editingRgb}
                    onChange={(event) =>
                      setEditingRgb(
                        event.target.value,
                      )
                    }
                    placeholder="5, 19, 29"
                    disabled={editing}
                    className="input"
                  />
                </FormField>

                <FormField
                  label="HEX"
                  htmlFor="edit-color-hex"
                >
                  <div className="flex gap-2">
                    <input
                      id="edit-color-hex"
                      value={editingHex}
                      onChange={(event) =>
                        setEditingHex(
                          event.target.value,
                        )
                      }
                      placeholder="#05131D"
                      disabled={editing}
                      className="input"
                    />

                    <div
                      className="h-10 w-10 shrink-0 rounded-md border"
                      style={{
                        backgroundColor:
                          editingHex ||
                          "#ffffff",
                      }}
                    />
                  </div>
                </FormField>
              </div>

              {editError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {editError}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  disabled={editing}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editing}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {editing
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// =========================================================
// FORM FIELD
// =========================================================

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      {children}
    </div>
  );
}