"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { Container } from "./Container";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Restaurants", href: "/restaurants" },
  { label: "Cuisines", href: "/restaurants?filter=cuisine" },
  { label: "My Bookings", href: "/bookings" },
];

function UserMenu({ username, isAdmin, onLogout }: { username: string; isAdmin: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button — first initial of username */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="User menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-[var(--radius-full)] flex items-center justify-center text-body-sm-strong transition-opacity hover:opacity-80 cursor-pointer"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-on-primary)",
        }}
      >
        {username[0].toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-[var(--radius-xl)] overflow-hidden z-50"
          style={{
            backgroundColor: "var(--color-canvas)",
            border: "1px solid var(--color-canvas-soft)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          }}
        >
          {/* Username */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--color-canvas-soft)" }}
          >
            <p className="text-body-sm text-[var(--color-mute)]">Signed in as</p>
            <p className="text-body-sm-strong text-[var(--color-ink)] truncate">@{username}</p>
          </div>

          {/* Links */}
          <div className="p-2 flex flex-col gap-0.5">
            <Link
              href="/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-body-sm text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)] transition-colors"
            >
              <FontAwesomeIcon icon={faCalendarDays} className="w-4 text-[var(--color-mute)]" />
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-body-sm text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)] transition-colors"
              >
                <FontAwesomeIcon icon={faGear} className="w-4 text-[var(--color-mute)]" />
                Admin panel
              </Link>
            )}
          </div>

          {/* Sign out */}
          <div
            className="p-2"
            style={{ borderTop: "1px solid var(--color-canvas-soft)" }}
          >
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-body-sm text-[var(--color-negative)] hover:bg-[var(--color-canvas-soft)] transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function NavBar() {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-canvas)] border-b border-[var(--color-canvas-soft)]">
      <Container>
        <nav className="flex items-center justify-between py-[var(--spacing-md)]">
          {/* Logo */}
          <Link
            href="/"
            className="text-display-xs text-[var(--color-ink)] hover:opacity-80 transition-opacity"
          >
            Table<span style={{ color: "var(--color-primary)" }}>Book</span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-[var(--spacing-2xl)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-sm-strong text-[var(--color-ink)] hover:text-[var(--color-body)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth slot — empty during loading to avoid flash */}
          <div className="flex items-center gap-[var(--spacing-md)] min-w-[120px] justify-end">
            {!loading && !isAuthenticated && (
              <>
                <Link href="/auth/login">
                  <Button variant="tertiary">Sign in</Button>
                </Link>
                <Link href="/auth/register" className="hidden sm:inline-flex">
                  <Button variant="primary">Get started</Button>
                </Link>
              </>
            )}
            {!loading && isAuthenticated && user && (
              <UserMenu username={user.username} isAdmin={isAdmin} onLogout={logout} />
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
