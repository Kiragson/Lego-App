"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Edit,
  FolderKanban,
  Plus,
  Search,
  X,
} from "lucide-react";
import DeleteCategoryButton from "./DeleteCategoryButton";

type Category = {
  id: string;
  name: string;
  _count: {
    elements: number;
  };
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "elements-asc"
  | "elements-desc";

export default function CatalogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/catalog/category");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load categories.",
          );
        }

        setCategories(data);
      } catch (error) {
        console.error(error);
        setError("Nie udało się załadować kategorii.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "elements-asc":
          return a._count.elements - b._count.elements;

        case "elements-desc":
          return b._count.elements - a._count.elements;

        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [categories, search, sort]);

  // ---------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------

  function openCreateDialog() {
    setNewCategoryName("");
    setCreateError("");
    setCreateOpen(true);
  }

  function closeCreateDialog() {
    if (creating) {
      return;
    }

    setCreateOpen(false);
    setNewCategoryName("");
    setCreateError("");
  }

  async function handleCreateCategory(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = newCategoryName.trim();

    if (!name) {
      setCreateError("Category name is required.");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/catalog/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(
          data.error || "Failed to create category.",
        );
        return;
      }

      const newCategory: Category = {
        ...data,
        _count: {
          elements: 0,
        },
      };

      setCategories((current) => [...current, newCategory]);

      closeCreateDialog();
    } catch (error) {
      console.error(error);
      setCreateError("Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  // ---------------------------------------------------------
  // EDIT
  // ---------------------------------------------------------

  function openEditDialog(category: Category) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditError("");
    setEditOpen(true);
  }

  function closeEditDialog() {
    if (editing) {
      return;
    }

    setEditOpen(false);
    setEditingCategoryId("");
    setEditingCategoryName("");
    setEditError("");
  }

  async function handleEditCategory(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = editingCategoryName.trim();

    if (!name) {
      setEditError("Category name is required.");
      return;
    }

    if (!editingCategoryId) {
      setEditError("Category ID is missing.");
      return;
    }

    setEditing(true);
    setEditError("");

    try {
      const response = await fetch("/api/catalog/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCategoryId,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(
          data.error || "Failed to update category.",
        );
        return;
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategoryId
            ? {
                ...category,
                name: data.name,
              }
            : category,
        ),
      );

      closeEditDialog();
    } catch (error) {
      console.error(error);
      setEditError("Something went wrong.");
    } finally {
      setEditing(false);
    }
  }

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              <FolderKanban className="h-7 w-7 text-primary" />
              LEGO Categories
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage categories used to organize LEGO elements.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Toolbar */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search categories..."
                className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Sort */}
            <div className="relative sm:w-64">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="h-10 w-full appearance-none rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
              >
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                <option value="elements-desc">
                  Elements: most first
                </option>
                <option value="elements-asc">
                  Elements: least first
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Results info */}
        {categories.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filteredCategories.length} of{" "}
              {categories.length} categories
            </span>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="font-medium text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Empty */}
        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FolderKanban className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              No categories yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Get started by adding your first category to
              organize your catalog elements.
            </p>

            <button
              type="button"
              onClick={openCreateDialog}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/95"
            >
              <Plus className="h-4 w-4" />
              Add your first category
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          /* No search results */
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold">
              No categories found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No category matches &quot;{search}&quot;.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Category cards */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="group flex min-h-44 flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                      {category.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2
                        className="truncate font-semibold text-foreground"
                        title={category.name}
                      >
                        {category.name}
                      </h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        LEGO category
                      </p>
                    </div>
                  </div>
                </div>

                {/* Element count */}
                <div className="mt-6">
                  <div className="text-2xl font-bold tracking-tight">
                    {category._count.elements}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {category._count.elements === 1
                      ? "element"
                      : "elements"}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center justify-end gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => openEditDialog(category)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <DeleteCategoryButton
                    id={category.id}
                    name={category.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE CATEGORY DIALOG
          ===================================================== */}

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-category-title"
            className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-category-title"
                  className="text-lg font-semibold"
                >
                  Add Category
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a category for organizing LEGO
                  elements.
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

            <form
              onSubmit={handleCreateCategory}
              className="mt-6 space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="category-name"
                  className="text-sm font-medium"
                >
                  Category name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={newCategoryName}
                  onChange={(event) =>
                    setNewCategoryName(event.target.value)
                  }
                  placeholder="Bricks"
                  autoFocus
                  required
                  disabled={creating}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {createError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeCreateDialog}
                  disabled={creating}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT CATEGORY DIALOG
          ===================================================== */}

      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-category-title"
            className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-category-title"
                  className="text-lg font-semibold"
                >
                  Edit Category
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the category name.
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

            <form
              onSubmit={handleEditCategory}
              className="mt-6 space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="edit-category-name"
                  className="text-sm font-medium"
                >
                  Category name
                </label>

                <input
                  id="edit-category-name"
                  type="text"
                  value={editingCategoryName}
                  onChange={(event) =>
                    setEditingCategoryName(event.target.value)
                  }
                  autoFocus
                  required
                  disabled={editing}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {editError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {editError}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  disabled={editing}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editing}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}