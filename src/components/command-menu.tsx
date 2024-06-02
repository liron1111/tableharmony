"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { useCallback, useState } from "react";

import { docsConfig } from "@/config/docs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LaptopIcon,
  LinkIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full rounded-[0.5rem] bg-background md:w-64 lg:w-96",
        )}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          {docsConfig.mainNav.map((navItem) => (
            <CommandItem
              key={navItem.href}
              value={navItem.title}
              onSelect={() => {
                runCommand(() => router.push(navItem.href as string));
              }}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {navItem.title}
            </CommandItem>
          ))}
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
