import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, CheckSquare, Map, BookOpen, BarChart3, Calendar, Sparkles } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Target className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">Personal Goal Mastery</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your all-in-one productivity companion for tracking goals, building habits, 
            planning routines, and mastering your personal development journey.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Goal Management</h3>
              <p className="text-muted-foreground">
                Set, track, and achieve your goals with categories, priorities, and visual progress tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <CheckSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Habit Tracking</h3>
              <p className="text-muted-foreground">
                Build lasting habits with streak tracking, daily check-ins, and motivational nudges.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Routine Planning</h3>
              <p className="text-muted-foreground">
                Schedule daily and weekly routines with time blocks and recurring events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Map className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Learning Roadmaps</h3>
              <p className="text-muted-foreground">
                Create visual learning paths with sequential steps and resource links.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personal Journal</h3>
              <p className="text-muted-foreground">
                Reflect on your journey with mood tracking and date-based organization.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your progress with charts, trends, and achievement summaries.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Ready to master your goals?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of achievers using PGMA to transform their productivity
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login-cta"
              >
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
