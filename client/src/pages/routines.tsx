import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RoutineEvent {
  id: string
  title: string
  time: string
  category: "tech" | "personal" | "study"
  recurring: boolean
}

export default function Routines() {
  // TODO: Remove mock data - replace with actual API calls
  const mockRoutines: RoutineEvent[] = [
    {
      id: '1',
      title: 'DSA Practice',
      time: '07:00 - 09:00',
      category: 'tech',
      recurring: true,
    },
    {
      id: '2',
      title: 'Computer Networks Lecture',
      time: '10:00 - 11:30',
      category: 'study',
      recurring: true,
    },
    {
      id: '3',
      title: 'Meta Course Session',
      time: '14:00 - 16:00',
      category: 'tech',
      recurring: true,
    },
    {
      id: '4',
      title: 'GO Classes',
      time: '18:00 - 19:00',
      category: 'study',
      recurring: true,
    },
    {
      id: '5',
      title: 'Evening Workout',
      time: '19:30 - 20:30',
      category: 'personal',
      recurring: true,
    },
  ]

  const categoryColors = {
    tech: 'chart-1',
    study: 'chart-2',
    personal: 'chart-3',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Routines</h1>
          <p className="text-muted-foreground">
            Schedule and manage your daily routines
          </p>
        </div>
        <Button data-testid="button-create-routine">
          <Plus className="h-4 w-4 mr-2" />
          New Routine
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRoutines.map((routine) => (
              <div
                key={routine.id}
                className="flex items-center gap-4 p-3 rounded-md hover-elevate"
                data-testid={`routine-${routine.id}`}
              >
                <div className={`h-12 w-1 rounded-full bg-${categoryColors[routine.category]}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{routine.title}</h3>
                  <p className="text-sm text-muted-foreground">{routine.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {routine.recurring && (
                    <Badge variant="outline">Recurring</Badge>
                  )}
                  <Badge variant="secondary" className={`bg-${categoryColors[routine.category]} bg-opacity-20`}>
                    {routine.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{mockRoutines.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              scheduled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">6.5h</div>
            <p className="text-sm text-muted-foreground mt-1">
              allocated today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">3.5h</div>
            <p className="text-sm text-muted-foreground mt-1">
              available slots
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
