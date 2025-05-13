
import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, "HH:mm") : "12:00"
  )

  const handleTimeChange = React.useCallback((time: string) => {
    setSelectedTime(time)
    if (date) {
      const [hours, minutes] = time.split(":")
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10))
      newDate.setMinutes(parseInt(minutes, 10))
      setDate(newDate)
    }
  }, [date, setDate])

  // Update time when date changes
  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  // Update the date with the selected time
  const handleSelect = React.useCallback((selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(":")
      selectedDate.setHours(parseInt(hours, 10))
      selectedDate.setMinutes(parseInt(minutes, 10))
    }
    setDate(selectedDate)
  }, [selectedTime, setDate])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPp", { locale: ptBR }) : <span>Selecione data e hora</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col space-y-2 p-2">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedTime}
                  onValueChange={handleTimeChange}
                >
                  <SelectTrigger className="h-8 w-[110px]">
                    <SelectValue placeholder={selectedTime} />
                  </SelectTrigger>
                  <SelectContent className="h-48 overflow-y-auto">
                    {Array.from({ length: 24 * 4 }).map((_, i) => {
                      const hour = Math.floor(i / 4)
                      const minute = (i % 4) * 15
                      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                      return (
                        <SelectItem
                          key={timeString}
                          value={timeString}
                          className="cursor-pointer"
                        >
                          {timeString}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                locale={ptBR}
                initialFocus
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
