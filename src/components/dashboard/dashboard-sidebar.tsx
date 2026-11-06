"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Globe2,
  LayoutDashboard,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Tags,
  Users,
  WalletCards,
} from "lucide-react";

const workspaceLinks = [
  [LayoutDashboard, "Overview", "/dashboard"],
  [ShoppingCart, "Orders", "/dashboard/orders"],
  [ShoppingBag, "Products", "/dashboard/products"],
  [Users, "Customers", "/dashboard/customers"],
  [Tags, "Discounts", "/dashboard/discounts"],
  [Globe2, "Online Store", "/dashboard/store"],
  [BarChart3, "Analytics", "/dashboard/analytics"],
] as const;

const settingsLinks = [
  [Settings2, "Store Settings", "/dashboard/settings"],
  [Globe2, "Domains", "/dashboard/domains"],
  [WalletCards, "Billing & Plan", "/dashboard/billing"],
] as const;

function NavigationLink({
  icon,
  label,
  href,
  active,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  active: boolean;
}) {
  const Icon = icon;

  return (
    <Link className={`sidebar-link${active ? " active" : ""}`} href={href}>
      <span className="sidebar-icon" aria-hidden="true">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <Link href="/dashboard" className="brand" aria-label="ShopKit dashboard">
        <span>shop</span>
        <strong>kit</strong>
      </Link>

      <div className="store-switcher">
        <span className="store-avatar">N</span>
        <span>
          <strong>Northstar Goods</strong>
          <small>northstar.shopkit.co</small>
        </span>
      </div>

      <nav aria-label="Workspace navigation">
        <p className="nav-heading">WORKSPACE</p>
        {workspaceLinks.map(([icon, label, href]) => (
          <NavigationLink
            key={href}
            icon={icon}
            label={label}
            href={href}
            active={pathname === href}
          />
        ))}
        <div className="nav-divider" />
        <p className="nav-heading settings-heading">SETTINGS</p>
        {settingsLinks.map(([icon, label, href]) => (
          <NavigationLink
            key={href}
            icon={icon}
            label={label}
            href={href}
            active={pathname === href}
          />
        ))}
      </nav>

      <div className="profile-card">
        <Avatar className="profile-avatar">
          <AvatarImage
            src="https://github.com/Adityakishore0.png"
            alt="Ahmad Malik"
          />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <span>
          <strong>Ahmad Malik</strong>
          <small>Starter · 12 days left</small>
        </span>
      </div>
    </aside>
  );
}
