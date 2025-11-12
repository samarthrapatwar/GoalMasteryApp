import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Target, CheckSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Goal, Habit } from "@shared/schema"

interface AnalyticsData {
  goals: {
    total: number
    active: number
    completed: number
    completionRate: number
  }
  habits: {
    total: number
    completedToday: number
    longestStreak: number
  }
  journal: {
    totalEntries: number
  }
}

export default function Analytics() {
  const { data: analytics, isLoading: loadingAnalytics, isError: analyticsError, error: analyticsErrorMessage } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  })

  const { data: goals = [], isLoading: loadingGoals, isError: goalsError, error: goalsErrorMessage } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  })

  const isLoading = loadingAnalytics || loadingGoals
  const isError = analyticsError || goalsError
  const error = analyticsErrorMessage || goalsErrorMessage

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 max-w-md">
          <p className="text-destructive text-center mb-4">
            Failed to load analytics: {(error as Error).message}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  const categoryData = goals.reduce((acc, goal) => {
    const category = goal.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalGoals = goals.length
  const categoryPercentages = Object.entries(categoryData).map(([category, count]) => ({
    category,
    percentage: totalGoals > 0 ? Math.round((count / totalGoals) * 100) : 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Goals
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {analytics?.goals?.active || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {analytics?.goals?.total || 0} total goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Habits Today
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {analytics?.habits?.completedToday || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {analytics?.habits?.total || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Longest Streak
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {analytics?.habits?.longestStreak || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {analytics?.goals?.completionRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              goals completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Categories Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryPercentages.length > 0 ? (
              categoryPercentages.map(({ category, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No goal categories yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-md bg-chart-2/10">
                <div className="h-10 w-10 rounded-full bg-chart-2 flex items-center justify-center text-white font-bold">
                  {analytics?.habits?.longestStreak || 0}
                </div>
                <div>
                  <p className="font-medium">Longest Habit Streak</p>
                  <p className="text-sm text-muted-foreground">Keep it going!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-chart-1/10">
                <div className="h-10 w-10 rounded-full bg-chart-1 flex items-center justify-center text-white font-bold">
                  {analytics?.goals?.completed || 0}
                </div>
                <div>
                  <p className="font-medium">Goals Completed</p>
                  <p className="text-sm text-muted-foreground">Great progress!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md bg-chart-3/10">
                <div className="h-10 w-10 rounded-full bg-chart-3 flex items-center justify-center text-white font-bold">
                  {analytics?.journal?.totalEntries || 0}
                </div>
                <div>
                  <p className="font-medium">Journal Entries</p>
                  <p className="text-sm text-muted-foreground">Keep reflecting</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
