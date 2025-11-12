import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar as CalendarIcon, Trash2, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import type { Routine } from "@shared/schema"

interface RoutineFormData {
  title: string
  startTime: string
  endTime: string
  category: string
}

export default function Routines() {
  const [showForm, setShowForm] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [deletingRoutine, setDeletingRoutine] = useState<Routine | null>(null)
  const [formData, setFormData] = useState<RoutineFormData>({
    title: "",
    startTime: "",
    endTime: "",
    category: "tech",
  })
  const { toast } = useToast()

  const { data: routines = [], isLoading, isError, error } = useQuery<Routine[]>({
    queryKey: ['/api/routines'],
  })

  const createRoutineMutation = useMutation({
    mutationFn: async (data: RoutineFormData) => {
      return await apiRequest('/api/routines', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] })
      setShowForm(false)
      setFormData({ title: "", startTime: "", endTime: "", category: "tech" })
      toast({
        title: "Success",
        description: "Routine created successfully",
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
        description: error.message || "Failed to create routine",
        variant: "destructive",
      })
    },
  })

  const updateRoutineMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RoutineFormData }) => {
      return await apiRequest(`/api/routines/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] })
      setEditingRoutine(null)
      setFormData({ title: "", startTime: "", endTime: "", category: "tech" })
      toast({
        title: "Success",
        description: "Routine updated successfully",
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
        description: error.message || "Failed to update routine",
        variant: "destructive",
      })
    },
  })

  const deleteRoutineMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/routines/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] })
      setDeletingRoutine(null)
      toast({
        title: "Success",
        description: "Routine deleted successfully",
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
        description: error.message || "Failed to delete routine",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRoutine) {
      updateRoutineMutation.mutate({ id: editingRoutine.id, data: formData })
    } else {
      createRoutineMutation.mutate(formData)
    }
  }

  const openEditDialog = (routine: Routine) => {
    setEditingRoutine(routine)
    setFormData({
      title: routine.title,
      startTime: routine.startTime,
      endTime: routine.endTime,
      category: routine.category,
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
            Failed to load routines: {(error as Error).message}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

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
        <Button onClick={() => setShowForm(true)} data-testid="button-create-routine">
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
          {routines.length > 0 ? (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center gap-4 p-3 rounded-md hover-elevate"
                  data-testid={`routine-${routine.id}`}
                >
                  <div className={`h-12 w-1 rounded-full bg-${categoryColors[routine.category as keyof typeof categoryColors] || 'chart-1'}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{routine.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {routine.startTime} - {routine.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {routine.isRecurring && (
                      <Badge variant="outline">Recurring</Badge>
                    )}
                    <Badge variant="secondary" className={`bg-${categoryColors[routine.category as keyof typeof categoryColors] || 'chart-1'} bg-opacity-20`}>
                      {routine.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingRoutine(routine)}
                      data-testid={`button-delete-routine-${routine.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(routine)}
                      data-testid={`button-edit-routine-${routine.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No routines scheduled yet. Create your first routine to get started!
            </p>
          )}
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
            <div className="text-3xl font-bold font-mono">{routines.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              scheduled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recurring Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {routines.filter(r => r.isRecurring).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              repeating routines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {new Set(routines.map(r => r.category)).size}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              unique types
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm || !!editingRoutine} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false)
          setEditingRoutine(null)
          setFormData({ title: "", startTime: "", endTime: "", category: "tech" })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoutine ? 'Edit Routine' : 'Create New Routine'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., DSA Practice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-routine-title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  data-testid="input-routine-start-time"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  data-testid="input-routine-end-time"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" data-testid="select-routine-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowForm(false)
                setEditingRoutine(null)
              }}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-routine">
                {editingRoutine ? 'Update' : 'Create'} Routine
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRoutine} onOpenChange={(open) => !open && setDeletingRoutine(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingRoutine?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRoutine && deleteRoutineMutation.mutate(deletingRoutine.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
