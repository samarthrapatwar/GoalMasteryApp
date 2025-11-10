import { StatCard } from "@/components/stat-card"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { MotivationalQuote } from "@/components/motivational-quote"
import { GoalCard } from "@/components/goal-card"
import { HabitItem } from "@/components/habit-item"
import { Target, CheckSquare, Flame, TrendingUp } from "lucide-react"

export default function Dashboard() {
  // TODO: Remove mock data - replace with actual API calls
  const mockDeadlines = [
    {
      id: '1',
      title: 'Complete React Course',
      type: 'goal' as const,
      date: new Date(2025, 10, 12),
    },
    {
      id: '2',
      title: 'Submit DSA Assignment',
      type: 'goal' as const,
      date: new Date(2025, 10, 15),
    },
    {
      id: '3',
      title: 'Weekly Review',
      type: 'routine' as const,
      date: new Date(2025, 10, 17),
    },
  ]

  const mockGoals = [
    {
      id: '1',
      title: 'Complete React Advanced Course',
      description: 'Finish all modules of the Meta React advanced certification',
      category: 'Tech' as const,
      priority: 'high' as const,
      progress: 65,
      deadline: new Date(2025, 11, 15),
    },
    {
      id: '2',
      title: 'Solve 50 LeetCode Problems',
      description: 'Practice DSA for placement preparation',
      category: 'Skills' as const,
      priority: 'high' as const,
      progress: 42,
      deadline: new Date(2025, 11, 30),
    },
  ]

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
  ]

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
          value={12} 
          icon={Target}
          trend={{ value: 20, positive: true }}
        />
        <StatCard 
          title="Habits Tracked" 
          value={8} 
          icon={CheckSquare}
          trend={{ value: 14, positive: true }}
        />
        <StatCard 
          title="Current Streak" 
          value="15 days" 
          icon={Flame}
        />
        <StatCard 
          title="Completion Rate" 
          value="78%" 
          icon={TrendingUp}
          trend={{ value: 12, positive: true }}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  {...goal}
                  onEdit={() => console.log('Edit goal', goal.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
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
        </div>

        <div className="space-y-6">
          <UpcomingDeadlines deadlines={mockDeadlines} />
          <MotivationalQuote />
        </div>
      </div>
    </div>
  )
}
