import Link from "next/link";
import { Container } from "./Container";

const footerLinks = {
  Discover: [
    { label: "All Restaurants", href: "/restaurants" },
    { label: "Featured", href: "/restaurants?featured=true" },
    { label: "Cuisines", href: "/restaurants?filter=cuisine" },
  ],
  Account: [
    { label: "My Bookings", href: "/bookings" },
    { label: "Sign In", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="bg-[var(--color-ink)] text-[var(--color-canvas-soft)]"
    >
      <Container>
        <div className="py-[var(--spacing-3xl)]">
          {/* Top: logo + columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-2xl)] mb-[var(--spacing-3xl)]">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-display-xs mb-[var(--spacing-md)]">
                Table<span style={{ color: "var(--color-primary)" }}>Book</span>
              </p>
              <p className="text-body-sm text-[var(--color-mute)]">
                Discover great restaurants and book your perfect table in seconds.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <p className="text-caption uppercase tracking-widest text-[var(--color-mute)] mb-[var(--spacing-md)]">
                  {group}
                </p>
                <ul className="flex flex-col gap-[var(--spacing-sm)]">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-[var(--color-canvas-soft)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom: legal */}
          <div className="border-t border-[var(--color-body)] pt-[var(--spacing-xl)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--spacing-sm)]">
            <p className="text-caption text-[var(--color-mute)]">
              © {new Date().getFullYear()} TableBook. All rights reserved.
            </p>
            <p className="text-caption text-[var(--color-mute)]">
              Powered by TableBook Platform
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
