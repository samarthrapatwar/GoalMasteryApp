import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"

interface RoadmapStep {
  id: string
  title: string
  completed: boolean
}

interface RoadmapCardProps {
  id: string
  title: string
  steps: RoadmapStep[]
  onView?: () => void
}

export function RoadmapCard({ id, title, steps, onView }: RoadmapCardProps) {
  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <Card className="hover-elevate" data-testid={`card-roadmap-${id}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid={`text-roadmap-title-${id}`}>
          <MapPin className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-roadmap-progress-${id}`}>
              {completedSteps}/{steps.length} steps
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="space-y-2">
          {steps.slice(0, 3).map((step) => (
            <div key={step.id} className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${step.completed ? 'bg-chart-2' : 'bg-muted'}`} />
              <span className={step.completed ? 'text-muted-foreground line-through' : ''}>
                {step.title}
              </span>
            </div>
          ))}
          {steps.length > 3 && (
            <p className="text-sm text-muted-foreground">
              +{steps.length - 3} more steps
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onView}
          data-testid={`button-view-roadmap-${id}`}
        >
          View Roadmap
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
