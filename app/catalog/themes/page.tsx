import Link from "next/link";
import { prisma } from "@/prisma/client";

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      parent: true,
      _count: {
        select: {
          sets: true,
          children: true,
        },
      },
    },
  });

  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Themes</h1>
          <p>Lista tematów Rebrickable.</p>
        </div>

        <Link href="/catalog/themes/new">
          Dodaj theme
        </Link>
      </div>

      {themes.length === 0 ? (
        <p>Brak themes.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rebrickable ID</th>
              <th>Nazwa</th>
              <th>Parent</th>
              <th>Sets</th>
              <th>Children</th>
            </tr>
          </thead>

          <tbody>
            {themes.map((theme) => (
              <tr key={theme.id}>
                <td>{theme.rebrickableId}</td>
                <td>{theme.name}</td>
                <td>{theme.parent?.name ?? "—"}</td>
                <td>{theme._count.sets}</td>
                <td>{theme._count.children}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}