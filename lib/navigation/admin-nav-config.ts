/**
 * LEGO application admin/sidebar navigation.
 * Single source for sidebar routes and route prefetching.
 */

export type AdminNavItemConfig = {
  href: string;
  label: string;
};

export const ADMIN_DASHBOARD_ITEMS: AdminNavItemConfig[] = [
  {
    href: "/",
    label: "Dashboard",
  },
];

export const ADMIN_COLLECTION_ITEMS: AdminNavItemConfig[] = [
  {
    href: "/collection/sets",
    label: "Sets",
  },
  {
    href: "/collection/elements",
    label: "Elements",
  },
];

export const ADMIN_CATALOG_ITEMS: AdminNavItemConfig[] = [
  {
    href: "/catalog/sets",
    label: "Sets",
  },
  {
    href: "/catalog/elements",
    label: "Elements",
  },
  {
    href: "/catalog/colors",
    label: "Colors",
  },
  { 
    href: "/catalog/parts", 
    label: "Parts" 
  },
];

export const ADMIN_STORAGE_ITEMS: AdminNavItemConfig[] = [
  {
    href: "/storage/locations",
    label: "Locations",
  },
];

export const ADMIN_SETTINGS_ITEMS: AdminNavItemConfig[] = [
  {
    href: "/settings",
    label: "Settings",
  },
];

/**
 * Flat, deduplicated paths used by RouteWarmPrefetch.
 */
export function getAdminSidebarWarmPaths(): string[] {
  const paths = [
    ...ADMIN_DASHBOARD_ITEMS.map((item) => item.href),
    ...ADMIN_COLLECTION_ITEMS.map((item) => item.href),
    ...ADMIN_CATALOG_ITEMS.map((item) => item.href),
    ...ADMIN_STORAGE_ITEMS.map((item) => item.href),
    ...ADMIN_SETTINGS_ITEMS.map((item) => item.href),
  ];

  return [...new Set(paths)];
}