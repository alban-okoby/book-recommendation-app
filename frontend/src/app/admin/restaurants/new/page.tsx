import Link from "next/link";
import { RestaurantForm } from "@/components/admin/RestaurantForm";

export const metadata = { title: "New restaurant — Admin · TableBook" };

export default function NewRestaurantPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div>
        <p className="text-caption text-[var(--color-mute)] mb-1">
          <Link href="/admin/restaurants" className="hover:underline">Restaurants</Link>
          {" / New"}
        </p>
        <h1 className="text-display-xs text-[var(--color-ink)]">Add a restaurant</h1>
        <p className="text-body-md text-[var(--color-body)] mt-1">
          Fill in the details below. Only name and city are required to publish.
        </p>
      </div>

      <RestaurantForm />
    </div>
  );
}
