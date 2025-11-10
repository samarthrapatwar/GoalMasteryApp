import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import { useState } from "react"

interface HabitItemProps {
  id: string
  name: string
  streak: number
  completed: boolean
  frequency: "daily" | "weekly"
  onToggle?: (completed: boolean) => void
}

export function HabitItem({
  id,
  name,
  streak,
  completed: initialCompleted,
  frequency,
  onToggle,
}: HabitItemProps) {
  const [completed, setCompleted] = useState(initialCompleted)

  const handleToggle = (checked: boolean) => {
    setCompleted(checked)
    onToggle?.(checked)
  }

  return (
    <Card className="hover-elevate" data-testid={`card-habit-${id}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <Checkbox
          checked={completed}
          onCheckedChange={handleToggle}
          data-testid={`checkbox-habit-${id}`}
        />
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`} data-testid={`text-habit-name-${id}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {frequency === "daily" ? "Daily" : "Weekly"}
          </p>
        </div>
        {streak > 0 && (
          <Badge variant="outline" className="gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            <span data-testid={`text-streak-${id}`}>{streak} days</span>
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
