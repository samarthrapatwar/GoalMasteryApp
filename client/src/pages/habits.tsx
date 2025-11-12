import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { HabitItem } from "@/components/habit-item"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { isUnauthorizedError } from "@/lib/authUtils"
import type { Habit } from "@shared/schema"

interface HabitWithStatus extends Habit {
  completed: boolean
}

interface HabitFormData {
  name: string
  frequency: string
}

export default function Habits() {
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState<HabitFormData>({
    name: "",
    frequency: "daily",
  })
  const { toast } = useToast()

  const { data: habits = [], isLoading, isError, error } = useQuery<HabitWithStatus[]>({
    queryKey: ['/api/habits'],
  })

  const createHabitMutation = useMutation({
    mutationFn: async (data: HabitFormData) => {
      return await apiRequest('/api/habits', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setShowForm(false)
      setFormData({ name: "", frequency: "daily" })
      toast({
        title: "Success",
        description: "Habit created successfully",
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
        description: error.message || "Failed to create habit",
        variant: "destructive",
      })
    },
  })

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/habits/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setDeletingHabit(null)
      toast({
        title: "Success",
        description: "Habit deleted successfully",
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
        description: error.message || "Failed to delete habit",
        variant: "destructive",
      })
    },
  })

  const habitCheckInMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await apiRequest(`/api/habits/${id}/check-in`, "POST", {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      toast({
        title: "Success",
        description: "Habit checked in!",
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
        description: error.message || "Failed to check in habit",
        variant: "destructive",
      })
    },
  })

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HabitFormData }) => {
      return await apiRequest(`/api/habits/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setEditingHabit(null)
      setFormData({ name: "", frequency: "daily" })
      toast({
        title: "Success",
        description: "Habit updated successfully",
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
        description: error.message || "Failed to update habit",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingHabit) {
      updateHabitMutation.mutate({ id: editingHabit.id, data: formData })
    } else {
      createHabitMutation.mutate(formData)
    }
  }

  const openEditDialog = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      frequency: habit.frequency,
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
            Failed to load habits: {(error as Error).message}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  const completedToday = habits.filter(h => h.completed).length
  const totalHabits = habits.length
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0)
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Habits</h1>
          <p className="text-muted-foreground">
            Build and track your daily and weekly habits
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-create-habit">
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
            <div className="text-3xl font-bold font-mono">{longestStreak}</div>
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
            <div className="text-3xl font-bold font-mono">{completionRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">
              today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-2">
              <div className="flex-1">
                <HabitItem
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
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(habit)}
                data-testid={`button-edit-habit-${habit.id}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeletingHabit(habit)}
                data-testid={`button-delete-habit-${habit.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))
        ) : (
          <Card className="p-8">
            <p className="text-muted-foreground text-center">
              No habits tracked yet. Start building good habits today!
            </p>
          </Card>
        )}
      </div>

      <Dialog open={showForm || !!editingHabit} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false)
          setEditingHabit(null)
          setFormData({ name: "", frequency: "daily" })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHabit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="e.g., Code for 1 hour"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-habit-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger id="frequency" data-testid="select-habit-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowForm(false)
                setEditingHabit(null)
              }}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-habit">
                {editingHabit ? 'Update' : 'Create'} Habit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingHabit?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingHabit && deleteHabitMutation.mutate(deletingHabit.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
