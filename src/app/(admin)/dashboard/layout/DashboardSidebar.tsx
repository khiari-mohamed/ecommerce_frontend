
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  Users,
  ShoppingCart,
  Settings,
  Briefcase,
  LogOut,
  Folder,
  Zap,
  Mail,
  MessageSquare,
  ImageIcon,
  KeyRound,
  UserPlus,
  Unlock,
  FileText,
  Star,
  User,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", icon: <Home size={20} />, href: "/dashboard" },
  { name: "Analytics", icon: <BarChart2 size={20} />, href: "/dashboard/analytics" },
  { name: "Users", icon: <Users size={20} />, href: "/dashboard/users" },
  { name: "Products", icon: <Briefcase size={20} />, href: "/dashboard/products" },
  { name: "Categories", icon: <Folder size={20} />, href: "/dashboard/categories" },
  { name: "Subcategories", icon: <Folder size={20} />, href: "/dashboard/subcategories" },
  { name: "Orders", icon: <ShoppingCart size={20} />, href: "/dashboard/orders" },
  // --- Paymee link added below ---
  { name: "Paymee Transactions", icon: <ShoppingCart size={20} />, href: "/dashboard/payments/paymee" },
  { name: "Packs", icon: <Briefcase size={20} />, href: "/dashboard/packs" },
  { name: "Musculation Products", icon: <Briefcase size={20} />, href: "/dashboard/musculation-products" },
  { name: "Blogs", icon: <Folder size={20} />, href: "/dashboard/blogs" },
  { name: "Vente Flash", icon: <Zap size={20} />, href: "/dashboard/vente-flash" },
  { name: "Brands", icon: <Folder size={20} />, href: "/dashboard/brands" },
  { name: "aromas", icon: <Star size={20} />, href: "/dashboard/flavors" },
   { name: "Clients", icon: <User size={20} />, href: "/dashboard/clients" },
  { name: "Newsletter", icon: <Mail size={20} />, href: "/dashboard/newsletter" },
  //chart page 
  { name: "Charts", icon: <BarChart2 size={20} />, href: "/dashboard/charts" },
  { name: "Testimonials", icon: <MessageSquare size={20} />, href: "/dashboard/testimonials" },
  { name: "Banners", icon: <ImageIcon size={20} />, href: "/dashboard/banners" },
  { name: "Documents view", icon: <FileText size={20} />, href: "/dashboard/documents" },
  { name: "Factures & Bons de Commande view", icon: <FileText size={20} />, href: "/dashboard/facture" },
  //new corect dcument page 
  { name: "Factures print", icon: <FileText size={20} />, href: "/dashboard/fatourat" },
  { name: "Reviews", icon: <Star size={20} />, href: "/dashboard/review" },
  { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/pages/settings" },
  ];

// Auth section links
const authLinks = [
  { name: "Login", icon: <KeyRound size={20} />, href: "/dashboard/auth/login" },
  { name: "Register", icon: <UserPlus size={20} />, href: "/dashboard/auth/register" },
  { name: "Forgot Password", icon: <Unlock size={20} />, href: "/dashboard/auth/forgot-password" },
  { name: "Reset Password", icon: <Unlock size={20} />, href: "/dashboard/auth/reset-password" },
];

export default function DashboardSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Height of header (in px) - adjust if your header height changes!
  const HEADER_HEIGHT = 64;

  // Mobile: slide in/out
  const sidebarClass =
    "dashboard-sidebar" +
    (collapsed ? " dashboard-sidebar-collapsed" : "") +
    (open ? " dashboard-sidebar-mobile-open" : " dashboard-sidebar-mobile-closed");

  return (
    <aside
      className={sidebarClass}
      style={{ top: HEADER_HEIGHT, zIndex: 50, transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)" }}
      tabIndex={-1}
      aria-modal={open ? "true" : undefined}
      role="dialog"
    >
      {/* Logo & Collapse Button */}
      <div className="dashboard-sidebar-header">
        <div className="dashboard-sidebar-logo">
          <span className="dashboard-sidebar-logo-text">
            {collapsed ? "AD" : "AdminDashboard"}
          </span>
        </div>
        <button
          className="dashboard-sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
        >
          <svg
            className={`dashboard-sidebar-collapse-icon${collapsed ? " dashboard-sidebar-collapse-icon-rotated" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
          </svg>
        </button>
        {/* Mobile close button */}
        <button
          className="dashboard-sidebar-mobile-close md:hidden"
          aria-label="Close sidebar"
          style={{ marginLeft: 8 }}
          onClick={onClose}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      {/* Navigation */}
      <nav className="dashboard-sidebar-nav">
        <ul className="dashboard-sidebar-nav-list">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "dashboard-sidebar-link" +
                    (collapsed ? " dashboard-sidebar-link-collapsed" : "") +
                    (isActive ? " dashboard-sidebar-link-active" : "")
                  }
                >
                  <span className="dashboard-sidebar-link-icon">{link.icon}</span>
                  {!collapsed && <span className="dashboard-sidebar-link-label">{link.name}</span>}
                </Link>
              </li>
            );
          })}
          {/* Divider */}
          <li className="dashboard-sidebar-divider" style={{ margin: "1.5rem 0", borderTop: "1px solid #e5e7eb" }} />
          {/* Auth Section Label */}
          {!collapsed && (
            <li className="dashboard-sidebar-section-label" style={{ padding: "0.5rem 1.25rem", color: "#818cf8", fontWeight: 600, fontSize: "0.95rem" }}>
              Auth
            </li>
          )}
          {/* Auth Links */}
          {authLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "dashboard-sidebar-link" +
                    (collapsed ? " dashboard-sidebar-link-collapsed" : "") +
                    (isActive ? " dashboard-sidebar-link-active" : "")
                  }
                >
                  <span className="dashboard-sidebar-link-icon">{link.icon}</span>
                  {!collapsed && <span className="dashboard-sidebar-link-label">{link.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer (Logout or User) */}
      <div className="dashboard-sidebar-footer">
        <Link href="/dashboard/auth/logout" className="dashboard-sidebar-logout">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
