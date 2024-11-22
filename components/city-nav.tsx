"use client"
import Link from "next/link";
import { HOUSE_PRICES_HISTORY } from "@/lib/data/house-prices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function CityNav({ currentCity }: { currentCity: string }) {
  const router = useRouter();
  const cities = Object.keys(HOUSE_PRICES_HISTORY);

  return (
    <Select
      value={currentCity}
      onValueChange={(city) => router.push(`/${city}`)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}