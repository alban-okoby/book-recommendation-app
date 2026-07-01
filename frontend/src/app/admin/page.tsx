"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faCalendarDays, faUsers } from "@fortawesome/free-solid-svg-icons";

const QUICK_LINKS = [
  {
    icon: faUtensils,
    label: "Add restaurant",
    description: "Create a new restaurant listing",
    href: "/admin/restaurants/new",
    cta: "New restaurant",
  },
  {
    icon: faCalendarDays,
    label: "All restaurants",
    description: "View and manage existing listings",
    href: "/admin/restaurants",
    cta: "View all",
  },
  {
    icon: faUsers,
    label: "Browse as user",
    description: "See the site from a guest perspective",
    href: "/restaurants",
    cta: "Browse",
  },
];

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display-xs text-[var(--color-ink)]">Admin dashboard</h1>
        <p className="text-body-md text-[var(--color-body)] mt-1">
          Manage restaurants, bookings, and content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ icon, label, description, href, cta }) => (
          <div
            key={href}
            className="rounded-[var(--radius-xl)] p-6 flex flex-col gap-4"
            style={{
              background: "var(--color-canvas)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center"
              style={{ background: "var(--color-canvas-soft)" }}
            >
              <FontAwesomeIcon icon={icon} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-body-md-strong text-[var(--color-ink)]">{label}</p>
              <p className="text-body-sm text-[var(--color-mute)] mt-0.5">{description}</p>
            </div>
            <Link
              href={href}
              className="mt-auto text-body-sm-strong text-[var(--color-primary)] hover:underline"
            >
              {cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
