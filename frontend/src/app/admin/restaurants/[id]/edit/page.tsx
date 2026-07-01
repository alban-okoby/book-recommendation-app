"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import { restaurants as restaurantsApi } from "@/lib/api";
import type { Restaurant } from "@/types/restaurant";

export default function EditRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    restaurantsApi
      .get(id)
      .then(({ restaurant }) => setRestaurant(restaurant))
      .catch(() => setError("Restaurant not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <FontAwesomeIcon icon={faUtensils} className="text-display-xs text-[var(--color-mute)]" />
        <p className="text-body-md text-[var(--color-mute)]">{error || "Restaurant not found."}</p>
        <Link href="/admin/restaurants" className="text-body-sm text-[var(--color-primary)] hover:underline">
          ← Back to restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div>
        <p className="text-caption text-[var(--color-mute)] mb-1">
          <Link href="/admin/restaurants" className="hover:underline">Restaurants</Link>
          {` / Edit`}
        </p>
        <h1 className="text-display-xs text-[var(--color-ink)]">{restaurant.name}</h1>
        <p className="text-body-md text-[var(--color-body)] mt-1">
          Edit the details below, then save changes.
        </p>
      </div>

      <RestaurantForm restaurantId={id} initialData={restaurant} />
    </div>
  );
}
