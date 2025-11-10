import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { StatCard } from "@/components/stat-card"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { MotivationalQuote } from "@/components/motivational-quote"
import { GoalCard } from "@/components/goal-card"
import { HabitItem } from "@/components/habit-item"
import { Target, CheckSquare, Flame, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isUnauthorizedError } from "@/lib/authUtils"
import { useEffect } from "react"
import type { Goal, Habit } from "@shared/schema"

interface HabitWithStatus extends Habit {
  completed: boolean
}

export default function Dashboard() {
  const { toast } = useToast()

  // Fetch data from API
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  })

  const { data: habits = [], isLoading: habitsLoading } = useQuery<HabitWithStatus[]>({
    queryKey: ['/api/habits'],
  })

  const { data: analytics } = useQuery<{
    goals: { total: number; active: number; completed: number; completionRate: number }
    habits: { total: number; completedToday: number; longestStreak: number }
    journal: { totalEntries: number }
  }>({
    queryKey: ['/api/analytics'],
  })

  // Get active goals and habits
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 2)
  const todayHabits = habits.slice(0, 2)

  // Create deadlines from goals
  const deadlines = activeGoals.map(goal => ({
    id: goal.id,
    title: goal.title,
    type: 'goal' as const,
    date: new Date(goal.deadline),
  })).slice(0, 3)

  // Handle habit check-in
  const habitCheckInMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await apiRequest(`/api/habits/${id}/check-in`, "POST", {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        })
        setTimeout(() => {
          window.location.href = "/api/login"
        }, 500)
        return
      }
      toast({
        title: "Error",
        description: error.message || "Failed to check in habit",
        variant: "destructive",
      })
    },
  })

  if (goalsLoading || habitsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your progress overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Goals" 
          value={analytics?.goals?.active || 0} 
          icon={Target}
        />
        <StatCard 
          title="Habits Tracked" 
          value={analytics?.habits?.total || 0} 
          icon={CheckSquare}
        />
        <StatCard 
          title="Longest Streak" 
          value={`${analytics?.habits?.longestStreak || 0} days`}
          icon={Flame}
        />
        <StatCard 
          title="Completion Rate" 
          value={`${analytics?.goals?.completionRate || 0}%`}
          icon={TrendingUp}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            {activeGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    description={goal.description}
                    category={goal.category as any}
                    priority={goal.priority as any}
                    progress={goal.progress}
                    deadline={new Date(goal.deadline)}
                    onEdit={() => console.log('Edit goal', goal.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No active goals yet. Create your first goal to get started!
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
            {todayHabits.length > 0 ? (
              <div className="space-y-3">
                {todayHabits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    streak={habit.currentStreak}
                    completed={habit.completed}
                    frequency={habit.frequency as any}
                    onToggle={(checked) => {
                      if (checked && !habit.completed) {
                        habitCheckInMutation.mutate({ id: habit.id })
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No habits tracked yet. Start building good habits today!
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <UpcomingDeadlines deadlines={deadlines} />
          <MotivationalQuote />
        </div>
      </div>
    </div>
  )
}
