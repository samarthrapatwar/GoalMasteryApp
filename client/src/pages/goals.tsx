import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { GoalCard } from "@/components/goal-card"
import { GoalForm, GoalFormData } from "@/components/goal-form"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, CheckCircle, Archive } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { isUnauthorizedError } from "@/lib/authUtils"
import type { Goal } from "@shared/schema"
import { Card } from "@/components/ui/card"

export default function Goals() {
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null)
  const [progressValue, setProgressValue] = useState(0)
  const { toast } = useToast()

  const { data: goals = [], isLoading, isError, error } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  })

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      return await apiRequest('/api/goals', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setShowForm(false)
      toast({
        title: "Success",
        description: "Goal created successfully",
      })
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
        description: error.message || "Failed to create goal",
        variant: "destructive",
      })
    },
  })

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Goal> }) => {
      return await apiRequest(`/api/goals/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setEditingGoal(null)
      setProgressGoal(null)
      toast({
        title: "Success",
        description: "Goal updated successfully",
      })
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
        description: error.message || "Failed to update goal",
        variant: "destructive",
      })
    },
  })

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/goals/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setDeletingGoal(null)
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      })
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
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      })
    },
  })

  const handleCreateGoal = (data: GoalFormData) => {
    createGoalMutation.mutate(data)
  }

  const handleEditGoal = (data: GoalFormData) => {
    if (!editingGoal) return
    updateGoalMutation.mutate({
      id: editingGoal.id,
      data,
    })
  }

  const handleUpdateProgress = () => {
    if (!progressGoal) return
    updateGoalMutation.mutate({
      id: progressGoal.id,
      data: { progress: progressValue },
    })
  }

  const handleCompleteGoal = (goal: Goal) => {
    updateGoalMutation.mutate({
      id: goal.id,
      data: { status: 'completed', progress: 100 },
    })
  }

  const handleArchiveGoal = (goal: Goal) => {
    updateGoalMutation.mutate({
      id: goal.id,
      data: { status: 'archived' },
    })
  }

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
            Failed to load goals: {(error as Error).message}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const archivedGoals = goals.filter(g => g.status === 'archived')

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

      <div className="space-y-8">
        {/* Active Goals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Goals ({activeGoals.length})</h2>
          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="relative">
                  <GoalCard
                    id={goal.id}
                    title={goal.title}
                    description={goal.description}
                    category={goal.category as any}
                    priority={goal.priority as any}
                    progress={goal.progress}
                    deadline={new Date(goal.deadline)}
                    onEdit={() => {
                      const menu = document.getElementById(`menu-${goal.id}`)
                      menu?.click()
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div id={`menu-${goal.id}`} className="hidden" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setProgressGoal(goal)
                          setProgressValue(goal.progress)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditingGoal(goal)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompleteGoal(goal)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveGoal(goal)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeletingGoal(goal)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <p className="text-muted-foreground text-center">
                No active goals yet. Create your first goal to get started!
              </p>
            </Card>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Goals ({completedGoals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  title={goal.title}
                  description={goal.description}
                  category={goal.category as any}
                  priority={goal.priority as any}
                  progress={goal.progress}
                  deadline={new Date(goal.deadline)}
                  onEdit={() => setDeletingGoal(goal)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Archived Goals */}
        {archivedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Archived Goals ({archivedGoals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  title={goal.title}
                  description={goal.description}
                  category={goal.category as any}
                  priority={goal.priority as any}
                  progress={goal.progress}
                  deadline={new Date(goal.deadline)}
                  onEdit={() => setDeletingGoal(goal)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Goal Dialog */}
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

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <GoalForm
              onSubmit={handleEditGoal}
              onCancel={() => setEditingGoal(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={!!progressGoal} onOpenChange={(open) => !open && setProgressGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Progress: {progressValue}%</Label>
              <Slider
                value={[progressValue]}
                onValueChange={([value]) => setProgressValue(value)}
                max={100}
                step={5}
                data-testid="slider-progress"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProgressGoal(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProgress} data-testid="button-save-progress">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingGoal} onOpenChange={(open) => !open && setDeletingGoal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingGoal?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingGoal && deleteGoalMutation.mutate(deletingGoal.id)}
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
