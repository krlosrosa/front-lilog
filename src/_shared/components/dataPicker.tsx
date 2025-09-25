"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/_shared/components/ui/button"
import { Calendar } from "@/_shared/components/ui/calendar"
import { Label } from "@/_shared/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_shared/components/ui/popover"

type DataPickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}


export function DataPicker({ date, setDate }: DataPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
