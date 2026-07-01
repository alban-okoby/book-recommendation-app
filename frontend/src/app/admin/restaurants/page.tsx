"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faStar, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Button, Badge } from "@/components/ui";
import { restaurants as restaurantsApi } from "@/lib/api";
import type { Restaurant } from "@/types/restaurant";

export default function AdminRestaurantsPage() {
  const [list, setList] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    restaurantsApi
      .list({ page, limit: 20, sortBy: "newest" })
      .then(({ restaurants, pagination }) => {
        setList(restaurants);
        setTotalPages(pagination.pages);
      })
      .catch(() => setError("Failed to load restaurants."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-xs text-[var(--color-ink)]">Restaurants</h1>
          <p className="text-body-sm text-[var(--color-mute)] mt-0.5">
            {loading ? "Loading…" : `${list.length} listing${list.length !== 1 ? "s" : ""} on this page`}
          </p>
        </div>
        <Link href="/admin/restaurants/new">
          <Button variant="primary">
            <FontAwesomeIcon icon={faPlus} />
            New restaurant
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <p className="text-body-sm text-[var(--color-negative)]">{error}</p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-[var(--radius-xl)] animate-pulse"
              style={{ background: "var(--color-canvas-soft)" }}
            />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && list.length === 0 && !error && (
        <div
          className="rounded-[var(--radius-xl)] p-12 text-center"
          style={{ background: "var(--color-canvas)" }}
        >
          <FontAwesomeIcon icon={faUtensils} className="text-display-xs text-[var(--color-mute)] mb-3" />
          <p className="text-body-md text-[var(--color-mute)]">No restaurants yet.</p>
          <Link href="/admin/restaurants/new" className="mt-4 inline-block">
            <Button variant="primary">Add the first one</Button>
          </Link>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div
          className="rounded-[var(--radius-xl)] overflow-hidden"
          style={{ background: "var(--color-canvas)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {list.map((r, idx) => (
            <div
              key={r._id}
              className="flex items-center gap-4 px-6 py-4"
              style={{
                borderTop: idx > 0 ? "1px solid var(--color-canvas-soft)" : undefined,
              }}
            >
              {/* Thumbnail */}
              <div
                className="w-12 h-12 rounded-[var(--radius-lg)] shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: "var(--color-canvas-soft)" }}
              >
                {r.coverImage ? (
                  <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <FontAwesomeIcon icon={faUtensils} className="text-[var(--color-mute)]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-body-sm-strong text-[var(--color-ink)] truncate">{r.name}</p>
                <p className="text-caption text-[var(--color-mute)]">
                  {r.address.city}
                  {r.address.country !== "US" ? `, ${r.address.country}` : ""} · {r.priceRange}
                </p>
              </div>

              {/* Cuisine badges */}
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                {r.cuisine.slice(0, 2).map((c) => (
                  <Badge key={c} variant="neutral">{c}</Badge>
                ))}
              </div>

              {/* Rating */}
              {r.ratings.count > 0 && (
                <div className="hidden md:flex items-center gap-1 shrink-0">
                  <FontAwesomeIcon icon={faStar} className="text-[var(--color-primary)] text-xs" />
                  <span className="text-body-sm text-[var(--color-body)]">
                    {r.ratings.average.toFixed(1)}
                  </span>
                  <span className="text-caption text-[var(--color-mute)]">
                    ({r.ratings.count})
                  </span>
                </div>
              )}

              {/* Featured badge */}
              {r.isFeatured && <Badge variant="positive">Featured</Badge>}

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/restaurants/${r._id}`}>
                  <Button variant="secondary" className="text-body-sm px-3 py-1.5">
                    View
                  </Button>
                </Link>
                <Link href={`/admin/restaurants/${r._id}/edit`}>
                  <Button variant="tertiary" className="text-body-sm px-3 py-1.5">
                    <FontAwesomeIcon icon={faPen} />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-body-sm text-[var(--color-mute)]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
