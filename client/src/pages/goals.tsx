import { useState } from "react"
import { GoalCard } from "@/components/goal-card"
import { GoalForm, GoalFormData } from "@/components/goal-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Goals() {
  const [showForm, setShowForm] = useState(false)

  // TODO: Remove mock data - replace with actual API calls
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
    {
      id: '3',
      title: 'Read Tech Book Monthly',
      description: 'Complete one technical book each month',
      category: 'Personal' as const,
      priority: 'medium' as const,
      progress: 80,
      deadline: new Date(2025, 10, 30),
    },
    {
      id: '4',
      title: 'Build Portfolio Website',
      description: 'Create a professional portfolio showcasing projects',
      category: 'Tech' as const,
      priority: 'high' as const,
      progress: 25,
      deadline: new Date(2025, 11, 20),
    },
  ]

  const handleCreateGoal = (goal: GoalFormData) => {
    console.log('Creating goal:', goal)
    setShowForm(false)
    // TODO: Add API call to create goal
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Goals</h1>
          <p className="text-muted-foreground">
            Track and manage your personal and professional goals
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-create-goal">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            {...goal}
            onEdit={() => console.log('Edit goal', goal.id)}
          />
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm
            onSubmit={handleCreateGoal}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
