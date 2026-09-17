import Link from "next/link";
import { prisma } from "@/prisma/client";

export default async function CatalogSetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const set = await prisma.set.findUnique({
    where: {
      id,
    },
    include: {
      class: true,
      elements: {
        include: {
          element: {
            include: {
              part: true,
              color: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!set) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-card p-8">
          <h1 className="text-xl font-semibold">Set not found</h1>

          <Link
            href="/catalog/sets"
            className="mt-4 inline-block text-sm underline"
          >
            ← Back to Sets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link
          href="/catalog/sets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Sets
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {set.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {set.setNumber && (
                <span className="rounded-md border px-2 py-1">
                  {set.setNumber}
                </span>
              )}

              <span className="rounded-md border px-2 py-1">
                {set.type}
              </span>

              {set.class && (
                <span className="rounded-md border px-2 py-1">
                  {set.class.name}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/catalog/sets/${set.id}/elements/new`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add Element
          </Link>
        </div>
      </div>

      {set.description && (
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Description</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {set.description}
          </p>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="border-b bg-muted/50 px-4 py-3">
          <h2 className="font-semibold">Set Elements</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Elements that belong to this LEGO set.
          </p>
        </div>

        {set.elements && set.elements.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="font-medium">No elements yet</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Add the first element to this set.
            </p>

            <Link
              href={`/catalog/sets/${set.id}/elements/new`}
              className="mt-4 inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Add Element
            </Link>
          </div>
        ) : (
          <div>
            {set.elements.map((setElement) => (
              <div
                key={setElement.id}
                className="grid grid-cols-6 gap-4 border-b px-4 py-4 text-sm last:border-0"
              >
                <div>
                  <div className="font-medium">
                    {setElement.element.legoElementNumber}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Element
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-medium">
                    {setElement.element.name}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {setElement.element.part?.partNumber || "No Part"}
                  </div>
                </div>

                <div>
                  <div className="font-medium">
                    {setElement.element.color?.name || "—"}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Color
                  </div>
                </div>

                <div>
                  <div className="font-medium">
                    {setElement.quantity}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Quantity
                  </div>
                </div>

                <div>
                  {setElement.isSpare ? (
                    <span className="inline-flex rounded-md border px-2 py-1 text-xs font-medium">
                      Spare
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Regular</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}