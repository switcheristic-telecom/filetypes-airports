"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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
import { Airport } from "@/utils/airport";

type Option = {
  value: string;
  label: string;
};

interface AirportComboboxProps {
  className?: string;
  airports: Airport[];
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

export function AirportCombobox({
  value,
  setValue,
  className,
  airports,
}: AirportComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const airportOptions = airports.map((airport) => ({
    value: airport.iata_code,
    label: airport.iata_code,
  }));

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? airportOptions.find(
                  (airportOption) => airportOption.value === value,
                )?.label
              : "Select..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[70vw] max-w-96 p-0 font-bitmap">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList>
              <CommandEmpty>No airportOption found.</CommandEmpty>
              <CommandGroup>
                {airportOptions.map((airportOption) => (
                  <CommandItem
                    key={airportOption.value}
                    value={airportOption.value}
                    disabled={false}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {airportOption.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === airportOption.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
