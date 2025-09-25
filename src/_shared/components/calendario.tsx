import * as React from "react"
import { Calendar } from "@/_shared/components/ui/calendar"
type CalendarioProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
} 

export function Calendario({ date, setDate }: CalendarioProps) {  
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}
