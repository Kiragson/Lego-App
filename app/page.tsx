import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function HomeRoute() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-amber-50/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-6 sm:p-8">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            Panel Kolekcjonera
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            LEGO Collection
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600">
            Witaj z powrotem
            {user.name ? `, ${user.name}` : ""}! Zarządzaj swoimi
            zestawami, elementami i miejscami przechowywania.
          </p>
        </div>

        {/* ========================================================= */}
        {/* KOLEKCJA */}
        {/* ========================================================= */}

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Twoja kolekcja
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
                Kolekcja
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Zarządzaj tym, co posiadasz i gdzie to przechowujesz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* MOJE ZESTAWY */}
            <Link
              href="/collection/sets"
              className="group relative overflow-hidden rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-100/70 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
                  🏰
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  Moje zestawy
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Twoje posiadane zestawy LEGO, ich stan, kompletność
                  oraz informacje o budowie.
                </p>

                <div className="mt-7 flex items-center text-sm font-semibold text-amber-600 transition-colors group-hover:text-amber-700">
                  Przejdź do zestawów
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* MINIFIGURKI */}
            <Link
              href="/collection/minifigs"
              className="group relative overflow-hidden rounded-3xl border border-orange-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-lg"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-100/70 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  🧑‍🚀
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  Minifigurki
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Przeglądaj i organizuj swoje minifigurki oraz ich
                  elementy.
                </p>

                <div className="mt-7 flex items-center text-sm font-semibold text-orange-600 transition-colors group-hover:text-orange-700">
                  Przejdź do minifigurek
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* STORAGE */}
            <Link
              href="/collection/storage"
              className="group relative overflow-hidden rounded-3xl border border-stone-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-500/40 hover:shadow-lg"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-stone-100 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-2xl transition-all duration-300 group-hover:bg-stone-600 group-hover:text-white">
                  🗄️
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  Storage
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Organizuj pudełka, szuflady, półki i inne miejsca
                  przechowywania elementów.
                </p>

                <div className="mt-7 flex items-center text-sm font-semibold text-stone-600 transition-colors group-hover:text-stone-700">
                  Zarządzaj storage
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* SEPARATOR */}
        <div className="my-12 border-t border-amber-900/10" />

        {/* ========================================================= */}
        {/* ZARZĄDZANIE KATALOGIEM */}
        {/* ========================================================= */}

        <section>
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-lg text-white">
                ⚙️
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Administracja
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Zarządzanie katalogiem
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Zarządzanie danymi katalogowymi wykorzystywanymi przez
              kolekcję. Sekcja przeznaczona dla administratorów.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* KOLORY */}
            <Link
              href="/catalog/colors"
              className="group flex items-center gap-4 rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900/20 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100 text-xl">
                🎨
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-900">
                  Kolory
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Paleta kolorów elementów
                </p>
              </div>

              <span className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-zinc-700">
                →
              </span>
            </Link>

            {/* KATEGORIE */}
            <Link
              href="/catalog/category"
              className="group flex items-center gap-4 rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900/20 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
                🗂️
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-900">
                  Kategorie
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Organizacja katalogu elementów
                </p>
              </div>

              <span className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-zinc-700">
                →
              </span>
            </Link>

            {/* ELEMENTY */}
            <Link
              href="/catalog/elements"
              className="group flex items-center gap-4 rounded-2xl border border-zinc-900/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-900/20 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                🧱
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-900">
                  Elementy
                </h3>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Katalog części LEGO
                </p>
              </div>

              <span className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-zinc-700">
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
