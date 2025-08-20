"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import type { BasePublicWithTables } from "@/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [base, setBase] = React.useState<BasePublicWithTables>();

  console.log("value", value);
  console.log("base", base);

  const { data: bases } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      ofetch<BasePublicWithTables[]>("http://127.0.0.1:8000/bases"),
  });

  console.log("bases", bases);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[500px] justify-between"
        >
          {value && bases?.length
            ? bases.find((base) => base.name === value)?.name
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {bases?.map((base) => (
                <CommandItem
                  key={base.id}
                  value={base.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setBase(base);
                    setOpen(false);
                  }}
                >
                  {base.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === base.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
