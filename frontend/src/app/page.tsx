import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faGift, faArrowsRotate, faUtensils, faStar } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button, Badge, Card } from "@/components/ui";
import { HeroBand, ContentBand } from "@/components/bands";
import { BookingWidget } from "@/components/booking";
import type { Restaurant } from "@/types/restaurant";

const FEATURES: { variant: "dark" | "green" | "sage"; icon: IconDefinition; title: string; body: string }[] = [
  {
    variant: "dark",
    icon: faBolt,
    title: "Instant confirmation",
    body: "No waiting, no phone calls. Your table is confirmed in seconds.",
  },
  {
    variant: "green",
    icon: faGift,
    title: "Zero booking fees",
    body: "We never charge you to make a reservation. Always completely free.",
  },
  {
    variant: "sage",
    icon: faArrowsRotate,
    title: "Easy cancellation",
    body: "Plans change. Cancel your booking up to 2 hours before arrival.",
  },
];

async function getFeaturedRestaurants(): Promise<Restaurant[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/restaurants/featured`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.restaurants ?? [];
  } catch {
    return [];
  }
}

function FeaturedCard({ r }: { r: Restaurant }) {
  return (
    <Card variant="content" className="flex flex-col gap-[var(--spacing-md)]">
      {/* Cover image */}
      <div
        className="relative w-full h-44 rounded-[var(--radius-lg)] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "var(--color-canvas-soft)" }}
      >
        {r.coverImage ? (
          <Image src={r.coverImage} alt={r.name} fill className="object-cover" />
        ) : (
          <FontAwesomeIcon icon={faUtensils} className="text-display-md text-[var(--color-mute)]" />
        )}
      </div>

      {/* Name + rating */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-body-md-strong text-[var(--color-ink)] truncate">{r.name}</p>
          <p className="text-body-sm text-[var(--color-mute)]">
            {r.address.city}{r.address.country !== "US" ? `, ${r.address.country}` : ""}
          </p>
        </div>
        {r.ratings.count > 0 && (
          <Badge variant="positive" className="shrink-0">
            <FontAwesomeIcon icon={faStar} className="mr-1" />
            {r.ratings.average.toFixed(1)}
          </Badge>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-[var(--spacing-xs)]">
        {r.cuisine.slice(0, 2).map((c) => (
          <Badge key={c} variant="neutral">{c}</Badge>
        ))}
        <Badge variant="neutral">{r.priceRange}</Badge>
        {r.ratings.count > 0 && (
          <span className="text-caption text-[var(--color-mute)]">
            {r.ratings.count} review{r.ratings.count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <Link href={`/restaurants/${r._id}`} className="mt-auto">
        <Button variant="primary" className="w-full">Reserve a table</Button>
      </Link>
    </Card>
  );
}

export default async function Home() {
  const featured = await getFeaturedRestaurants();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <HeroBand
        headline={
          <>
            Your perfect<br />
            <span style={{ color: "var(--color-primary)" }}>table awaits.</span>
          </>
        }
        subtext="Discover and reserve tables at the finest restaurants — in seconds, with no fees."
        cta={
          <>
            <Link href="/restaurants">
              <Button variant="primary">Browse restaurants</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary">Get started free</Button>
            </Link>
          </>
        }
        widget={<BookingWidget />}
      />

      {/* ── Featured restaurants ───────────────────────────────── */}
      <ContentBand
        headline="Featured restaurants"
        subtext="Handpicked tables at the most acclaimed dining spots."
      >
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-xl)]">
            {featured.map((r) => (
              <FeaturedCard key={r._id} r={r} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-[var(--radius-xl)] py-16 text-center"
            style={{ background: "var(--color-canvas-soft)" }}
          >
            <FontAwesomeIcon icon={faUtensils} className="text-display-xs text-[var(--color-mute)] mb-3" />
            <p className="text-body-md text-[var(--color-mute)]">
              No featured restaurants yet — check back soon.
            </p>
          </div>
        )}

        <div className="mt-[var(--spacing-3xl)] text-center">
          <Link href="/restaurants">
            <Button variant="tertiary">View all restaurants</Button>
          </Link>
        </div>
      </ContentBand>

      {/* ── Feature strip ──────────────────────────────────────── */}
      <ContentBand soft>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-xl)]">
          {FEATURES.map(({ variant, icon, title, body }) => (
            <Card key={title} variant={variant} className="flex flex-col gap-[var(--spacing-md)]">
              <FontAwesomeIcon icon={icon} className="text-display-xs" />
              <p className="text-display-xs">{title}</p>
              <p
                className="text-body-sm"
                style={{
                  color: variant === "dark" ? "var(--color-canvas-soft)" : "var(--color-body)",
                }}
              >
                {body}
              </p>
            </Card>
          ))}
        </div>
      </ContentBand>

      {/* ── Dark CTA band ──────────────────────────────────────── */}
      <HeroBand
        dark
        headline="Ready to book your next meal?"
        subtext="Join thousands of diners who reserve their tables with TableBook every day."
        cta={
          <Link href="/auth/register">
            <Button variant="primary">Create free account</Button>
          </Link>
        }
      />
    </>
  );
}
