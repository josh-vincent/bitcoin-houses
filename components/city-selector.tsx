import React from "react";
import { getCurrentHousePrices } from "@/lib/api";
import { useCity } from "@/contexts/city-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CitySelector() {
  const { selectedCity, setSelectedCity } = useCity();
  const currentPrices = getCurrentHousePrices();
  const cities = Object.keys(currentPrices) as Array<keyof typeof currentPrices>;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Select City:</span>
      <Select value={selectedCity} onValueChange={setSelectedCity}>
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
    </div>
  );
}