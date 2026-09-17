"use client";

import { useState } from "react";

type DeleteCategoryButtonProps = {
id: string;
name: string;
};

export default function DeleteCategoryButton({
id,
name,
}: DeleteCategoryButtonProps) {
const [deleting, setDeleting] = useState(false);

async function handleDelete() {
const confirmed = window.confirm(
`Are you sure you want to delete category "${name}"?`,
);

if (!confirmed) {
  return;
}

setDeleting(true);

try {
  const response = await fetch("/api/catalog/category", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    window.alert(data.error || "Failed to delete category.");
    return;
  }

  window.location.reload();
} catch {
  window.alert("Something went wrong.");
} finally {
  setDeleting(false);
}

}

return ( <button
   type="button"
   onClick={handleDelete}
   disabled={deleting}
   className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
 >
{deleting ? "Deleting..." : "Delete"} </button>
);
}
