import Link from "next/link";
import { Plus, PackagePlus } from "lucide-react";
import { prisma } from "@/prisma/client";

export default async function CatalogSetsPage() {
  const sets = await prisma.set.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-amber-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Nagłówek strony */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-6 shadow-sm border border-amber-900/10">
          <div>
            <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
              Katalog
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              LEGO Sets
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Zarządzaj swoją kolekcją i zestawami klocków.
            </p>
          </div>

          <Link
            href="/catalog/sets/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow"
          >
            <Plus className="h-4 w-4" />
            Add set
          </Link>
        </div>

        {/* Stan: Brak zestawów */}
        {sets.length === 0 ? (
          <div className="rounded-2xl border border-amber-900/10 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <PackagePlus className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">No sets yet</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Dodaj swój pierwszy zestaw LEGO do katalogu, aby zacząć kolekcjonować.
            </p>

            <Link
              href="/catalog/sets/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-900/20 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
            >
              <Plus className="h-4 w-4" />
              Add your first set
            </Link>
          </div>
        ) : (
          /* Tabela / Lista zestawów (responsywna) */
          <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
            {/* Nagłówek tabeli (widoczny na większych ekranach) */}
            <div className="hidden sm:grid sm:grid-cols-4 border-b border-amber-900/10 bg-amber-50/50 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              <div>Set number</div>
              <div>Name</div>
              <div>Type</div>
              <div>Created</div>
            </div>

            <div className="divide-y divide-amber-900/5">
              {sets.map((set) => (
                <div
                  key={set.id}
                  className="flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-0 px-6 py-4 text-sm transition-colors hover:bg-amber-50/30"
                >
                  {/* Numer zestawu */}
                  <div className="flex items-center justify-between sm:justify-start">
                    <span className="sm:hidden text-xs font-semibold text-zinc-400">Numer:</span>
                    <span className="font-semibold text-amber-900">
                      {set.setNumber || "—"}
                    </span>
                  </div>

                  {/* Nazwa */}
                  <div className="flex items-center justify-between sm:justify-start">
                    <span className="sm:hidden text-xs font-semibold text-zinc-400">Nazwa:</span>
                    <span className="font-medium text-zinc-900">
                      {set.name}
                    </span>
                  </div>

                  {/* Typ */}
                  <div className="flex items-center justify-between sm:justify-start">
                    <span className="sm:hidden text-xs font-semibold text-zinc-400">Typ:</span>
                    <span className="inline-flex rounded-full bg-orange-100/60 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                      {set.type}
                    </span>
                  </div>

                  {/* Data utworzenia */}
                  <div className="flex items-center justify-between sm:justify-start text-zinc-500">
                    <span className="sm:hidden text-xs font-semibold text-zinc-400">Dodano:</span>
                    <span>
                      {new Date(set.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}