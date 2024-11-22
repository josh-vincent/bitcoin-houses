import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-4xl font-bold">404 - City Not Found</h1>
      <p className="text-muted-foreground">
        The city you're looking for doesn't exist in our database.
      </p>
      <Button asChild>
        <Link href="/sydney">Go to Sydney Market</Link>
      </Button>
    </div>
  );
}