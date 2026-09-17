import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/client";

export default async function ThemeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const theme = await prisma.theme.findUnique({
    where: {
      id,
    },
    include: {
      parent: true,
      children: {
        orderBy: {
          name: "asc",
        },
      },
      sets: {
        orderBy: [
          {
            year: "desc",
          },
          {
            rebrickableSetNum: "asc",
          },
        ],
      },
    },
  });

  if (!theme) {
    notFound();
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/catalog/themes">← Wróć do Themes</Link>
      </div>

      <h1>{theme.name}</h1>

      <div style={{ marginTop: 16 }}>
        <p>
          <strong>Rebrickable ID:</strong> {theme.rebrickableId}
        </p>

        <p>
          <strong>Parent:</strong>{" "}
          {theme.parent ? theme.parent.name : "—"}
        </p>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Subthemes</h2>

        {theme.children.length === 0 ? (
          <p>Brak subthemes.</p>
        ) : (
          <ul>
            {theme.children.map((child) => (
              <li key={child.id}>
                <Link href={`/catalog/themes/${child.id}`}>
                  {child.name}
                </Link>{" "}
                <span>
                  (Rebrickable ID: {child.rebrickableId})
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Sets</h2>

        {theme.sets.length === 0 ? (
          <p>Brak zestawów w tym Theme.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numer</th>
                <th>Nazwa</th>
                <th>Rok</th>
                <th>Części</th>
              </tr>
            </thead>

            <tbody>
              {theme.sets.map((set) => (
                <tr key={set.id}>
                  <td>
                    <Link href={`/catalog/sets/${set.id}`}>
                      {set.rebrickableSetNum}
                    </Link>
                  </td>
                  <td>{set.name}</td>
                  <td>{set.year}</td>
                  <td>{set.numParts ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}