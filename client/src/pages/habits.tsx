import { HabitItem } from "@/components/habit-item"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Habits() {
  // TODO: Remove mock data - replace with actual API calls
  const mockHabits = [
    {
      id: '1',
      name: 'Code for 1 hour',
      streak: 15,
      completed: true,
      frequency: 'daily' as const,
    },
    {
      id: '2',
      name: 'Solve 2 DSA problems',
      streak: 7,
      completed: false,
      frequency: 'daily' as const,
    },
    {
      id: '3',
      name: 'Review notes',
      streak: 3,
      completed: false,
      frequency: 'weekly' as const,
    },
    {
      id: '4',
      name: 'Practice typing',
      streak: 22,
      completed: true,
      frequency: 'daily' as const,
    },
    {
      id: '5',
      name: 'Read tech articles',
      streak: 5,
      completed: false,
      frequency: 'daily' as const,
    },
  ]

  const completedToday = mockHabits.filter(h => h.completed).length
  const totalHabits = mockHabits.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Habits</h1>
          <p className="text-muted-foreground">
            Build and track your daily and weekly habits
          </p>
        </div>
        <Button data-testid="button-create-habit">
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {completedToday}/{totalHabits}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              habits completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">22</div>
            <p className="text-sm text-muted-foreground mt-1">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">85%</div>
            <p className="text-sm text-muted-foreground mt-1">
              this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {mockHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            {...habit}
            onToggle={(checked) => console.log('Habit toggled:', habit.id, checked)}
          />
        ))}
      </div>
    </div>
  )
}
