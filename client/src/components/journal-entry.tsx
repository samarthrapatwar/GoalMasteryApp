import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Smile, Meh, Frown } from "lucide-react"

export type Mood = "happy" | "neutral" | "sad"

interface JournalEntryProps {
  id: string
  date: Date
  mood: Mood
  content: string
  onClick?: () => void
}

const moodIcons = {
  happy: Smile,
  neutral: Meh,
  sad: Frown,
}

const moodColors = {
  happy: "text-chart-2",
  neutral: "text-chart-4",
  sad: "text-chart-1",
}

export function JournalEntry({ id, date, mood, content, onClick }: JournalEntryProps) {
  const MoodIcon = moodIcons[mood]

  return (
    <Card 
      className="hover-elevate cursor-pointer" 
      onClick={onClick}
      data-testid={`card-journal-${id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base font-medium">
          {format(date, "EEEE, MMMM dd, yyyy")}
        </CardTitle>
        <Badge variant="outline" className="gap-1">
          <MoodIcon className={`h-3 w-3 ${moodColors[mood]}`} />
          {mood}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-journal-content-${id}`}>
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
