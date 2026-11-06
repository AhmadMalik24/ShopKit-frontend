"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useDashboardTheme } from "@/components/dashboard/dashboard-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const quickResults = [
  { title: "Orders", detail: "Review recent orders", icon: "↗" },
  { title: "Products", detail: "Manage your catalog", icon: "□" },
  { title: "Analytics", detail: "View store performance", icon: "⌁" },
];

export function DashboardHeaderActions() {
  const router = useRouter();
  const { theme, toggleTheme } = useDashboardTheme();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        setIsSearchOpen(true);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        searchRef.current?.blur();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const filteredResults = quickResults.filter((result) =>
    `${result.title} ${result.detail}`.toLowerCase().includes(search.toLowerCase()),
  );

  const signOut = () => {
    window.localStorage.removeItem("shopkit-session");
    setIsProfileOpen(false);
    router.push("/login");
  };

  return (
    <div className="header-actions">
      <div className="header-search" ref={searchContainerRef}>
        <label className="search-box">
          <Search size={15} aria-hidden="true" />
          <input
            ref={searchRef}
            value={search}
            aria-label="Search products and orders"
            placeholder="Search anything..."
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setIsSearchOpen(true);
            }}
          />
          {search ? (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={13} />
            </button>
          ) : (
            <kbd>⌘K</kbd>
          )}
        </label>
        {isSearchOpen && (
          <div className="search-popover">
            <p>{search ? "Search results" : "Quick navigation"}</p>
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <button type="button" className="search-result" key={result.title} onClick={() => setIsSearchOpen(false)}>
                  <span className="search-result-icon">{result.icon}</span>
                  <span><strong>{result.title}</strong><small>{result.detail}</small></span>
                </button>
              ))
            ) : (
              <span className="search-empty">No matching results</span>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className={`theme-toggle theme-toggle-icon ${theme === "light" ? "is-light" : ""}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="header-popover-wrap" ref={notificationsRef}>
        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Show notifications"
          aria-expanded={isNotificationsOpen}
          onClick={() => setIsNotificationsOpen((open) => !open)}
        >
          <Bell size={16} />
          <span className="notification-dot" />
        </button>
        {isNotificationsOpen && (
          <div className="notification-popover">
            <div className="popover-heading"><strong>Notifications</strong><span>3 new</span></div>
            <p>New order #SK-104 has been received.</p>
            <p>Your weekly store report is ready.</p>
            <button type="button" onClick={() => setIsNotificationsOpen(false)}>Mark all as read</button>
          </div>
        )}
      </div>

      <div className="header-popover-wrap" ref={profileRef}>
        <button
          type="button"
          className="user-pill avatar-trigger"
          aria-label="Open account menu"
          aria-expanded={isProfileOpen}
          title="Open Ahmad Malik account menu"
          onClick={() => setIsProfileOpen((open) => !open)}
        >
          <Avatar size="sm" className="mini-avatar">
            <AvatarImage
              src="https://github.com/Adityakishore0.png"
              alt="Ahmad Malik"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <span className="avatar-online" />
        </button>
        {isProfileOpen && (
          <div className="profile-popover">
            <div className="profile-popover-header">
              <Avatar size="lg" className="profile-avatar-large">
                <AvatarImage
                  src="https://github.com/Adityakishore0.png"
                  alt="Ahmad Malik"
                />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span><strong>Ahmad Malik</strong><small>ahmad@shopkit.com</small></span>
            </div>
            <button type="button"><User size={14} /> Profile</button>
            <button type="button"><Settings size={14} /> Account settings</button>
            <button type="button" className="profile-logout" onClick={signOut}><LogOut size={14} /> Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}
