import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Target, CheckSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function Analytics() {
  // TODO: Remove mock data - replace with actual API calls and real charts
  const weeklyData = {
    goalsCompleted: 8,
    goalsTotal: 12,
    habitsCompleted: 28,
    habitsTotal: 35,
    studyHours: 42,
    productivityScore: 85,
  }

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Goals
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {weeklyData.goalsCompleted}/{weeklyData.goalsTotal}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((weeklyData.goalsCompleted / weeklyData.goalsTotal) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Habit Consistency
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {Math.round((weeklyData.habitsCompleted / weeklyData.habitsTotal) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {weeklyData.habitsCompleted} of {weeklyData.habitsTotal} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Hours
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{weeklyData.studyHours}h</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productivity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{weeklyData.productivityScore}%</div>
            <p className="text-xs text-chart-2 mt-1">
              +12% from last week
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tech Skills</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Personal Development</span>
                <span className="font-medium">30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Academic</span>
                <span className="font-medium">25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const activity = [95, 87, 92, 78, 88, 65, 70][index]
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-10">{day}</span>
                    <Progress value={activity} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {activity}%
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-md bg-chart-2/10">
              <div className="h-10 w-10 rounded-full bg-chart-2 flex items-center justify-center text-white font-bold">
                15
              </div>
              <div>
                <p className="font-medium">15-Day Streak</p>
                <p className="text-sm text-muted-foreground">Maintained daily coding habit</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-chart-1/10">
              <div className="h-10 w-10 rounded-full bg-chart-1 flex items-center justify-center text-white font-bold">
                50
              </div>
              <div>
                <p className="font-medium">50 Problems Solved</p>
                <p className="text-sm text-muted-foreground">Completed LeetCode milestone</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-chart-3/10">
              <div className="h-10 w-10 rounded-full bg-chart-3 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <p className="font-medium">3 Roadmaps</p>
                <p className="text-sm text-muted-foreground">Created learning paths</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
