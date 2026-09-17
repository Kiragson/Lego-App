"use client";

import { useState } from "react";

type DeleteColorButtonProps = {
  id: string;
  name: string;
  elementCount: number;
};

export default function DeleteColorButton({
  id,
  name,
  elementCount,
}: DeleteColorButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (elementCount > 0) {
      window.alert(
        `Color "${name}" is used by ${elementCount} element variant(s) and cannot be deleted.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete color "${name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/catalog/colors", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.error || "Failed to delete color.");
        return;
      }

      window.location.reload();
    } catch {
      window.alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}