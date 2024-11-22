"use client";

import { Bitcoin, Home, Calculator, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6" />
          <span className="font-bold hidden md:inline-block">BTC vs Housing</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <ModeToggle />
        </nav>

        <div className="md:hidden flex items-center">
          <ModeToggle />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/market-data">Market Data</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/calculator">Calculators</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/education">Learn</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
}