"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Palette,
  Warehouse,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADMIN_DASHBOARD_ITEMS,
  ADMIN_COLLECTION_ITEMS,
  ADMIN_CATALOG_ITEMS,
  ADMIN_STORAGE_ITEMS,
  ADMIN_SETTINGS_ITEMS,
  type AdminNavItemConfig,
} from "@/lib/navigation/admin-nav-config";
import { adminSidebarLinkClass } from "@/lib/navigation/nav-link-styles";

const ADMIN_NAV_ICONS: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/collection/sets": Package,
  "/collection/elements": Package,
  "/catalog/sets": Package,
  "/catalog/elements": Package,
  "/catalog/colors": Palette,
  "/storage/locations": Warehouse,
  "/settings": Settings,
};

export default function AdminSidebar({
  collapsed = false,
}: {
  collapsed?: boolean;
} = {}) {
  const pathname = usePathname();

  const renderNavItems = (
    items: AdminNavItemConfig[],
    isSub = true,
  ) =>
    items.map((item) => {
      const Icon = ADMIN_NAV_ICONS[item.href] ?? Package;

      return (
        <Link
          key={item.href}
          href={item.href}
          prefetch
          className={cn(
            adminSidebarLinkClass(pathname, item.href, {
              isSub,
              collapsed,
            }),
          )}
          title={collapsed ? item.label : undefined}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />

          {!collapsed && (
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          )}
        </Link>
      );
    });

  if (collapsed) {
    return (
      <nav
        className="flex min-h-0 flex-col items-center gap-1 px-2"
        aria-label="LEGO navigation"
      >
        {renderNavItems(ADMIN_DASHBOARD_ITEMS, false)}

        <div className="my-1 w-6 border-t border-gray-200/50 dark:border-white/10" />

        {renderNavItems(ADMIN_COLLECTION_ITEMS)}

        <div className="my-1 w-6 border-t border-gray-200/50 dark:border-white/10" />

        {renderNavItems(ADMIN_CATALOG_ITEMS)}

        <div className="my-1 w-6 border-t border-gray-200/50 dark:border-white/10" />

        {renderNavItems(ADMIN_STORAGE_ITEMS)}

        <div className="my-1 w-6 border-t border-gray-200/50 dark:border-white/10" />

        {renderNavItems(ADMIN_SETTINGS_ITEMS)}
      </nav>
    );
  }

  return (
    <nav
      className="flex min-h-0 flex-col gap-1 p-2"
      aria-label="LEGO navigation"
    >
      <p className="px-2 pt-2 text-xs font-normal uppercase tracking-wider text-muted-foreground">
        Dashboard
      </p>
      {renderNavItems(ADMIN_DASHBOARD_ITEMS, false)}

      <p className="px-2 pt-3 text-xs font-normal uppercase tracking-wider text-muted-foreground">
        Collection
      </p>
      {renderNavItems(ADMIN_COLLECTION_ITEMS)}

      <p className="px-2 pt-3 text-xs font-normal uppercase tracking-wider text-muted-foreground">
        Catalog
      </p>
      {renderNavItems(ADMIN_CATALOG_ITEMS)}

      <p className="px-2 pt-3 text-xs font-normal uppercase tracking-wider text-muted-foreground">
        Storage
      </p>
      {renderNavItems(ADMIN_STORAGE_ITEMS)}

      <p className="px-2 pt-3 text-xs font-normal uppercase tracking-wider text-muted-foreground">
        Settings
      </p>
      {renderNavItems(ADMIN_SETTINGS_ITEMS)}
    </nav>
  );
}