import Link from "next/link";
import { ArrowLeft, Package, Users, Boxes } from "lucide-react";
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
      theme: true,
      inventories: {
        orderBy: {
          version: "desc",
        },
        take: 1,
        include: {
          parts: {
            include: {
              part: true,
              color: true,
            },
            orderBy: {
              part: {
                rebrickablePartNum: "asc",
              },
            },
          },
          minifigs: {
            include: {
              minifig: true,
            },
            orderBy: {
              minifig: {
                rebrickableFigNum: "asc",
              },
            },
          },
          sets: {
            include: {
              set: true,
            },
            orderBy: {
              set: {
                rebrickableSetNum: "asc",
              },
            },
          },
        },
      },
    },
  });

  if (!set) {
    return (
      <div className="min-h-screen bg-amber-50/20 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/catalog/sets"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sets
          </Link>

          <div className="mt-6 rounded-2xl border border-amber-900/10 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-zinc-900">
              Set not found
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Nie znaleziono zestawu o podanym ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inventory = set.inventories[0];

  return (
    <div className="min-h-screen bg-amber-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/catalog/sets"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sets
        </Link>

        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            LEGO Set
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            {set.name}
          </h1>

          <p className="mt-2 font-mono text-sm font-semibold text-amber-800">
            {set.rebrickableSetNum}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-400">
                Year
              </div>
              <div className="mt-1 text-lg font-bold text-zinc-900">
                {set.year}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-400">
                Parts
              </div>
              <div className="mt-1 text-lg font-bold text-zinc-900">
                {set.numParts ?? "—"}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <div className="text-xs font-semibold uppercase text-zinc-400">
                Theme
              </div>
              <div className="mt-1 text-lg font-bold text-zinc-900">
                {set.theme?.name ?? "—"}
              </div>
            </div>
          </div>
        </div>

        {!inventory ? (
          <div className="rounded-2xl border border-amber-900/10 bg-white p-8 text-center shadow-sm">
            <Package className="mx-auto h-8 w-8 text-amber-600" />

            <h2 className="mt-3 text-lg font-bold text-zinc-900">
              No inventory yet
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Dla tego zestawu nie ma jeszcze zaimportowanego inventory.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Boxes className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-zinc-400">
                      Parts
                    </div>
                    <div className="text-xl font-bold text-zinc-900">
                      {inventory.parts.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-zinc-400">
                      Minifigs
                    </div>
                    <div className="text-xl font-bold text-zinc-900">
                      {inventory.minifigs.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase text-zinc-400">
                  Inventory version
                </div>
                <div className="mt-1 text-xl font-bold text-zinc-900">
                  {inventory.version}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
              <div className="border-b border-amber-900/10 bg-amber-50/50 px-6 py-4">
                <h2 className="font-bold text-zinc-900">
                  Inventory parts
                </h2>
              </div>

              {inventory.parts.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">
                  Brak części w inventory.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {inventory.parts.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-mono text-sm font-semibold text-amber-800">
                          {item.part.rebrickablePartNum}
                        </div>
                        <div className="mt-1 text-sm text-zinc-900">
                          {item.part.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                          {item.color.name}
                        </span>

                        <span className="font-semibold text-zinc-900">
                          × {item.quantity}
                        </span>

                        {item.isSpare && (
                          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs text-orange-800">
                            Spare
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {inventory.minifigs.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
                <div className="border-b border-amber-900/10 bg-amber-50/50 px-6 py-4">
                  <h2 className="font-bold text-zinc-900">Minifigs</h2>
                </div>

                <div className="divide-y divide-zinc-100">
                  {inventory.minifigs.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <div className="font-mono text-sm font-semibold text-amber-800">
                          {item.minifig.rebrickableFigNum}
                        </div>
                        <div className="mt-1 text-sm text-zinc-900">
                          {item.minifig.name}
                        </div>
                      </div>

                      <span className="font-semibold text-zinc-900">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}