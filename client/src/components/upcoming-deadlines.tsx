import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle } from "lucide-react"
import { format, differenceInDays } from "date-fns"

interface Deadline {
  id: string
  title: string
  type: "goal" | "routine" | "habit"
  date: Date
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const sortedDeadlines = deadlines
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedDeadlines.map((deadline) => {
            const daysLeft = differenceInDays(deadline.date, new Date())
            const isUrgent = daysLeft <= 3 && daysLeft >= 0
            const isOverdue = daysLeft < 0

            return (
              <div
                key={deadline.id}
                className="flex items-center justify-between gap-2 p-2 rounded-md hover-elevate"
                data-testid={`deadline-${deadline.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(deadline.date, "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isOverdue ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  ) : isUrgent ? (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {daysLeft}d left
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {daysLeft}d left
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
          {deadlines.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming deadlines
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
