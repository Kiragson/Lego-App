"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Filter,
  ImageIcon,
  Plus,
  Search,
  X,
} from "lucide-react";
import DeleteElementButton from "./DeleteElementButton";

type Category = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  rgb: string | null;
  hex: string | null;
};

type Element = {
  id: string;
  elementNumber: string | null;
  partNumber: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  elementType:
    | "PART"
    | "MINIFIG"
    | "BOOK"
    | "STICKER"
    | "BOX"
    | "OTHER";
  categoryId: string | null;
  colorId: string | null;
  category: Category | null;
  color: Color | null;
};

const ELEMENT_TYPES = [
  "PART",
  "MINIFIG",
  "BOOK",
  "STICKER",
  "BOX",
  "OTHER",
] as const;

type SortOption =
  | "name-asc"
  | "name-desc"
  | "number-asc"
  | "number-desc";

export default function CatalogElementsPage() {
  const [elements, setElements] = useState<Element[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] =
    useState<SortOption>("name-asc");

  const [categoryFilter, setCategoryFilter] =
    useState("");
  const [typeFilter, setTypeFilter] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CREATE
  // =========================================================

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newElementNumber, setNewElementNumber] =
    useState("");
  const [newPartNumber, setNewPartNumber] =
    useState("");
  const [newName, setNewName] = useState("");
  const [newCategoryId, setNewCategoryId] =
    useState("");
  const [newColorId, setNewColorId] =
    useState("");
  const [newImageUrl, setNewImageUrl] =
    useState("");
  const [newDescription, setNewDescription] =
    useState("");

  // =========================================================
  // EDIT
  // =========================================================

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const [editingElementId, setEditingElementId] =
    useState("");

  const [editingElementNumber, setEditingElementNumber] =
    useState("");
  const [editingPartNumber, setEditingPartNumber] =
    useState("");
  const [editingName, setEditingName] =
    useState("");
  const [editingCategoryId, setEditingCategoryId] =
    useState("");
  const [editingColorId, setEditingColorId] =
    useState("");
  const [editingImageUrl, setEditingImageUrl] =
    useState("");
  const [editingDescription, setEditingDescription] =
    useState("");

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    async function loadData() {
      try {
        const [
          elementsResponse,
          categoriesResponse,
          colorsResponse,
        ] = await Promise.all([
          fetch("/api/catalog/elements"),
          fetch("/api/catalog/category"),
          fetch("/api/catalog/colors"),
        ]);

        const [
          elementsData,
          categoriesData,
          colorsData,
        ] = await Promise.all([
          elementsResponse.json(),
          categoriesResponse.json(),
          colorsResponse.json(),
        ]);

        if (!elementsResponse.ok) {
          throw new Error(
            elementsData.error ||
              "Failed to load elements.",
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.error ||
              "Failed to load categories.",
          );
        }

        if (!colorsResponse.ok) {
          throw new Error(
            colorsData.error ||
              "Failed to load colors.",
          );
        }

        setElements(elementsData);
        setCategories(categoriesData);
        setColors(colorsData);
      } catch (error) {
        console.error(error);

        setError(
          "Nie udało się załadować katalogu elementów.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredElements = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = elements.filter((element) => {
      const matchesSearch =
        !query ||
        element.name
          .toLowerCase()
          .includes(query) ||
        element.elementNumber
          ?.toLowerCase()
          .includes(query) ||
        element.partNumber
          ?.toLowerCase()
          .includes(query) ||
        element.category?.name
          .toLowerCase()
          .includes(query) ||
        element.color?.name
          .toLowerCase()
          .includes(query) ||
        element.elementType
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        !categoryFilter ||
        element.categoryId === categoryFilter;

      const matchesType =
        !typeFilter ||
        element.elementType === typeFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sort === "number-asc") {
        return (
          (a.elementNumber || "").localeCompare(
            b.elementNumber || "",
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          )
        );
      }

      if (sort === "number-desc") {
        return (
          (b.elementNumber || "").localeCompare(
            a.elementNumber || "",
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          )
        );
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    elements,
    search,
    sort,
    categoryFilter,
    typeFilter,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "" ||
    typeFilter !== "" ||
    sort !== "name-asc";

  function clearFilters() {
    setSearch("");
    setCategoryFilter("");
    setTypeFilter("");
    setSort("name-asc");
  }

  // =========================================================
  // CREATE DIALOG
  // =========================================================

  function openCreateDialog() {
    setNewElementNumber("");
    setNewPartNumber("");
    setNewName("");
    setNewCategoryId("");
    setNewColorId("");
    setNewImageUrl("");
    setNewDescription("");

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

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!newName.trim()) {
      setCreateError(
        "Name is required.",
      );
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const response = await fetch(
        "/api/catalog/elements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elementNumber:
              newElementNumber.trim() || null,
            partNumber:
              newPartNumber.trim() || null,
            name: newName.trim(),
            categoryId:
              newCategoryId || null,
            colorId:
              newColorId || null,
            imageUrl:
              newImageUrl.trim() || null,
            description:
              newDescription.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setCreateError(
          data.error ||
            "Failed to create element.",
        );
        return;
      }

      setElements((current) => [
        data,
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
  // EDIT DIALOG
  // =========================================================

  function openEditDialog(element: Element) {
    setEditingElementId(element.id);

    setEditingElementNumber(
      element.elementNumber || "",
    );

    setEditingPartNumber(
      element.partNumber || "",
    );

    setEditingName(element.name);

    setEditingCategoryId(
      element.categoryId || "",
    );

    setEditingColorId(
      element.colorId || "",
    );

    setEditingImageUrl(
      element.imageUrl || "",
    );

    setEditingDescription(
      element.description || "",
    );

    setEditError("");
    setEditOpen(true);
  }

  function closeEditDialog() {
    if (editing) {
      return;
    }

    setEditOpen(false);
    setEditingElementId("");
    setEditError("");
  }

  async function handleEdit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingName.trim()) {
      setEditError(
        "Name is required.",
      );
      return;
    }

    if (!editingElementId) {
      setEditError(
        "Element ID is missing.",
      );
      return;
    }

    setEditing(true);
    setEditError("");

    try {
      const response = await fetch(
        `/api/catalog/elements/${editingElementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elementNumber:
              editingElementNumber.trim() || null,
            partNumber:
              editingPartNumber.trim() || null,
            name: editingName.trim(),
            categoryId:
              editingCategoryId || null,
            colorId:
              editingColorId || null,
            imageUrl:
              editingImageUrl.trim() || null,
            description:
              editingDescription.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setEditError(
          data.error ||
            "Failed to update element.",
        );
        return;
      }

      setElements((current) =>
        current.map((element) =>
          element.id === editingElementId
            ? data
            : element,
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
          Loading elements...
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
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                LEGO Elements
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage parts, minifigures and
                other LEGO elements.
              </p>
            </div>

            <div className="hidden sm:block">
              <button
                type="button"
                onClick={openCreateDialog}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add element
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

        {/* FILTERS */}
        {elements.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row">
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
                  placeholder="Search elements..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* CATEGORY */}
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value,
                  )
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary lg:w-52"
              >
                <option value="">
                  All categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {/* TYPE */}
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value,
                  )
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary lg:w-44"
              >
                <option value="">
                  All types
                </option>

                {ELEMENT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>

              {/* SORT */}
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as SortOption,
                  )
                }
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary lg:w-48"
              >
                <option value="name-asc">
                  Name: A–Z
                </option>

                <option value="name-desc">
                  Name: Z–A
                </option>

                <option value="number-asc">
                  LEGO Number: low–high
                </option>

                <option value="number-desc">
                  LEGO Number: high–low
                </option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />

                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredElements.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {elements.length}
                  </span>{" "}
                  elements
                </span>
              </div>

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
        {elements.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold">
              No elements yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first LEGO element to
              the catalog.
            </p>

            <button
              type="button"
              onClick={openCreateDialog}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add element
            </button>
          </div>
        ) : filteredElements.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <Search className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No elements found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No element matches the current
              filters.
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
          /* ===================================================
             CARDS
             =================================================== */

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredElements.map((element) => (
              <div
                key={element.id}
                className="group flex min-h-[390px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden border-b bg-muted/30">
                  {element.imageUrl ? (
                    <img
                      src={element.imageUrl}
                      alt={element.name}
                      className="h-full w-full object-contain p-5 transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-10 w-10" />

                      <span className="text-xs">
                        No image
                      </span>
                    </div>
                  )}

                  {/* TYPE BADGE */}
                  <div className="absolute left-3 top-3 rounded-full border bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur">
                    {element.elementType}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-4">
                  {/* NAME */}
                  <h2
                    className="line-clamp-2 min-h-[40px] font-semibold leading-5 text-foreground"
                    title={element.name}
                  >
                    {element.name}
                  </h2>

                  {/* NUMBERS */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        LEGO Number
                      </span>

                      <span className="font-mono font-medium text-foreground">
                        {element.elementNumber ||
                          "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Part Number
                      </span>

                      <span className="font-mono font-medium text-foreground">
                        {element.partNumber ||
                          "—"}
                      </span>
                    </div>
                  </div>

                  {/* CATEGORY + COLOR */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {element.category && (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">
                        {element.category.name}
                      </span>
                    )}

                    {element.color && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">
                        {element.color.hex && (
                          <span
                            className="h-3 w-3 rounded-full border"
                            style={{
                              backgroundColor:
                                element.color
                                  .hex,
                            }}
                          />
                        )}

                        {element.color.name}
                      </span>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  {element.description && (
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {element.description}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto flex items-center justify-end gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        openEditDialog(element)
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition hover:bg-muted"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <DeleteElementButton
                      id={element.id}
                      name={element.name}
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
        aria-label="Add element"
        title="Add element"
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
            aria-labelledby="create-element-title"
            className="my-8 w-full max-w-2xl rounded-xl border bg-card p-6 shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-element-title"
                  className="text-lg font-semibold"
                >
                  Add Element
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a new LEGO element to the
                  catalog.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateDialog}
                disabled={creating}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreate}
              className="mt-6 space-y-5"
            >
              {/* LEGO NUMBER + PART NUMBER */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="LEGO Number"
                  htmlFor="new-element-number"
                >
                  <input
                    id="new-element-number"
                    value={newElementNumber}
                    onChange={(event) =>
                      setNewElementNumber(
                        event.target.value,
                      )
                    }
                    placeholder="3001"
                    disabled={creating}
                    className="input"
                  />
                </FormField>

                <FormField
                  label="Part Number"
                  htmlFor="new-part-number"
                >
                  <input
                    id="new-part-number"
                    value={newPartNumber}
                    onChange={(event) =>
                      setNewPartNumber(
                        event.target.value,
                      )
                    }
                    placeholder="3001"
                    disabled={creating}
                    className="input"
                  />
                </FormField>
              </div>

              {/* NAME */}
              <FormField
                label="Name"
                htmlFor="new-element-name"
                required
              >
                <input
                  id="new-element-name"
                  value={newName}
                  onChange={(event) =>
                    setNewName(
                      event.target.value,
                    )
                  }
                  placeholder="Brick 2 x 4"
                  required
                  disabled={creating}
                  className="input"
                />
              </FormField>

              {/* CATEGORY + COLOR */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Category"
                  htmlFor="new-category"
                >
                  <select
                    id="new-category"
                    value={newCategoryId}
                    onChange={(event) =>
                      setNewCategoryId(
                        event.target.value,
                      )
                    }
                    disabled={creating}
                    className="input"
                  >
                    <option value="">
                      No category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Color"
                  htmlFor="new-color"
                >
                  <select
                    id="new-color"
                    value={newColorId}
                    onChange={(event) =>
                      setNewColorId(
                        event.target.value,
                      )
                    }
                    disabled={creating}
                    className="input"
                  >
                    <option value="">
                      No color
                    </option>

                    {colors.map((color) => (
                      <option
                        key={color.id}
                        value={color.id}
                      >
                        {color.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* IMAGE URL */}
              <FormField
                label="Image URL"
                htmlFor="new-image-url"
              >
                <input
                  id="new-image-url"
                  type="url"
                  value={newImageUrl}
                  onChange={(event) =>
                    setNewImageUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                  disabled={creating}
                  className="input"
                />
              </FormField>

              {/* DESCRIPTION - OPTIONAL */}
              <FormField
                label="Description"
                htmlFor="new-description"
              >
                <textarea
                  id="new-description"
                  value={newDescription}
                  onChange={(event) =>
                    setNewDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Optional description..."
                  rows={4}
                  disabled={creating}
                  className="input resize-none"
                />
              </FormField>

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
                    : "Create Element"}
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
            aria-labelledby="edit-element-title"
            className="my-8 w-full max-w-2xl rounded-xl border bg-card p-6 shadow-xl"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-element-title"
                  className="text-lg font-semibold"
                >
                  Edit Element
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update the LEGO element.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditDialog}
                disabled={editing}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleEdit}
              className="mt-6 space-y-5"
            >
              {/* LEGO NUMBER + PART NUMBER */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="LEGO Number"
                  htmlFor="edit-element-number"
                >
                  <input
                    id="edit-element-number"
                    value={editingElementNumber}
                    onChange={(event) =>
                      setEditingElementNumber(
                        event.target.value,
                      )
                    }
                    disabled={editing}
                    className="input"
                  />
                </FormField>

                <FormField
                  label="Part Number"
                  htmlFor="edit-part-number"
                >
                  <input
                    id="edit-part-number"
                    value={editingPartNumber}
                    onChange={(event) =>
                      setEditingPartNumber(
                        event.target.value,
                      )
                    }
                    disabled={editing}
                    className="input"
                  />
                </FormField>
              </div>

              {/* NAME */}
              <FormField
                label="Name"
                htmlFor="edit-element-name"
                required
              >
                <input
                  id="edit-element-name"
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

              {/* CATEGORY + COLOR */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Category"
                  htmlFor="edit-category"
                >
                  <select
                    id="edit-category"
                    value={editingCategoryId}
                    onChange={(event) =>
                      setEditingCategoryId(
                        event.target.value,
                      )
                    }
                    disabled={editing}
                    className="input"
                  >
                    <option value="">
                      No category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Color"
                  htmlFor="edit-color"
                >
                  <select
                    id="edit-color"
                    value={editingColorId}
                    onChange={(event) =>
                      setEditingColorId(
                        event.target.value,
                      )
                    }
                    disabled={editing}
                    className="input"
                  >
                    <option value="">
                      No color
                    </option>

                    {colors.map((color) => (
                      <option
                        key={color.id}
                        value={color.id}
                      >
                        {color.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* IMAGE URL */}
              <FormField
                label="Image URL"
                htmlFor="edit-image-url"
              >
                <input
                  id="edit-image-url"
                  type="url"
                  value={editingImageUrl}
                  onChange={(event) =>
                    setEditingImageUrl(
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                  disabled={editing}
                  className="input"
                />
              </FormField>

              {/* DESCRIPTION - OPTIONAL */}
              <FormField
                label="Description"
                htmlFor="edit-description"
              >
                <textarea
                  id="edit-description"
                  value={editingDescription}
                  onChange={(event) =>
                    setEditingDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Optional description..."
                  rows={4}
                  disabled={editing}
                  className="input resize-none"
                />
              </FormField>

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
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}