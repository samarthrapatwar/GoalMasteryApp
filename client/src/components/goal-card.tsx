import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, MoreVertical } from "lucide-react"
import { format } from "date-fns"

export type GoalPriority = "high" | "medium" | "low"
export type GoalCategory = "Tech" | "Skills" | "Personal" | "Routine" | "Habits"

interface GoalCardProps {
  id: string
  title: string
  description: string
  category: GoalCategory
  priority: GoalPriority
  progress: number
  deadline: Date
  onEdit?: () => void
}

const priorityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
} as const

const categoryColors = {
  Tech: "chart-1",
  Skills: "chart-2",
  Personal: "chart-3",
  Routine: "chart-4",
  Habits: "chart-5",
}

export function GoalCard({
  id,
  title,
  description,
  category,
  priority,
  progress,
  deadline,
  onEdit,
}: GoalCardProps) {
  const isOverdue = deadline < new Date()
  
  return (
    <Card className="hover-elevate" data-testid={`card-goal-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className={`bg-chart-${categoryColors[category]} bg-opacity-10`}>
              {category}
            </Badge>
            <Badge variant={priorityColors[priority]}>
              {priority}
            </Badge>
          </div>
          <CardTitle className="text-lg" data-testid={`text-goal-title-${id}`}>{title}</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onEdit}
          data-testid={`button-goal-menu-${id}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-progress-${id}`}>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span className={isOverdue ? "text-destructive" : ""}>
            {format(deadline, "MMM dd, yyyy")}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
