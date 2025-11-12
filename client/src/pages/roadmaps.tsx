import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { RoadmapCard } from "@/components/roadmap-card"
import { Button } from "@/components/ui/button"
import { Plus, X, Check, Trash2, Edit } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { isUnauthorizedError } from "@/lib/authUtils"
import type { Roadmap, RoadmapStep } from "@shared/schema"

interface RoadmapWithSteps extends Roadmap {
  steps: RoadmapStep[]
}

interface RoadmapFormData {
  title: string
  description: string
  steps: { title: string; description: string }[]
}

export default function Roadmaps() {
  const [showForm, setShowForm] = useState(false)
  const [editingRoadmap, setEditingRoadmap] = useState<RoadmapWithSteps | null>(null)
  const [viewingRoadmap, setViewingRoadmap] = useState<RoadmapWithSteps | null>(null)
  const [deletingRoadmap, setDeletingRoadmap] = useState<RoadmapWithSteps | null>(null)
  const [formData, setFormData] = useState<RoadmapFormData>({
    title: "",
    description: "",
    steps: [],
  })
  const [newStepTitle, setNewStepTitle] = useState("")
  const { toast } = useToast()

  const { data: roadmaps = [], isLoading, isError, error } = useQuery<RoadmapWithSteps[]>({
    queryKey: ['/api/roadmaps'],
  })

  const createRoadmapMutation = useMutation({
    mutationFn: async (data: RoadmapFormData) => {
      return await apiRequest('/api/roadmaps', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roadmaps'] })
      setShowForm(false)
      setFormData({ title: "", description: "", steps: [] })
      toast({
        title: "Success",
        description: "Roadmap created successfully",
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
        description: error.message || "Failed to create roadmap",
        variant: "destructive",
      })
    },
  })

  const updateStepMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      return await apiRequest(`/api/roadmap-steps/${id}`, 'PATCH', { isCompleted })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roadmaps'] })
      toast({
        title: "Success",
        description: "Step updated successfully",
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
        description: error.message || "Failed to update step",
        variant: "destructive",
      })
    },
  })

  const deleteRoadmapMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/roadmaps/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roadmaps'] })
      setDeletingRoadmap(null)
      setViewingRoadmap(null)
      toast({
        title: "Success",
        description: "Roadmap deleted successfully",
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
        description: error.message || "Failed to delete roadmap",
        variant: "destructive",
      })
    },
  })

  const updateRoadmapMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RoadmapFormData }) => {
      return await apiRequest(`/api/roadmaps/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roadmaps'] })
      setEditingRoadmap(null)
      setFormData({ title: "", description: "", steps: [] })
      toast({
        title: "Success",
        description: "Roadmap updated successfully",
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
        description: error.message || "Failed to update roadmap",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRoadmap) {
      updateRoadmapMutation.mutate({ id: editingRoadmap.id, data: formData })
    } else {
      createRoadmapMutation.mutate(formData)
    }
  }

  const openEditDialog = (roadmap: RoadmapWithSteps) => {
    setEditingRoadmap(roadmap)
    setFormData({
      title: roadmap.title,
      description: roadmap.description || "",
      steps: roadmap.steps.map(s => ({ title: s.title, description: s.description || "" })),
    })
  }

  const addStep = () => {
    if (newStepTitle.trim()) {
      setFormData({
        ...formData,
        steps: [...formData.steps, { title: newStepTitle, description: "" }],
      })
      setNewStepTitle("")
    }
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
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
            Failed to load roadmaps: {(error as Error).message}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Roadmaps</h1>
          <p className="text-muted-foreground">
            Create and follow structured learning paths
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-create-roadmap">
          <Plus className="h-4 w-4 mr-2" />
          New Roadmap
        </Button>
      </div>

      {roadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              id={roadmap.id}
              title={roadmap.title}
              steps={roadmap.steps.map(s => ({
                id: s.id,
                title: s.title,
                completed: s.isCompleted,
              }))}
              onView={() => setViewingRoadmap(roadmap)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <p className="text-muted-foreground text-center">
            No roadmaps created yet. Create your first learning path to get started!
          </p>
        </Card>
      )}

      <Dialog open={showForm || !!editingRoadmap} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false)
          setEditingRoadmap(null)
          setFormData({ title: "", description: "", steps: [] })
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoadmap ? 'Edit Roadmap' : 'Create New Roadmap'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Full-Stack Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-roadmap-title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe this learning path"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-roadmap-description"
              />
            </div>
            <div className="space-y-2">
              <Label>Steps</Label>
              <div className="space-y-2">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={step.title} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a step"
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addStep()
                      }
                    }}
                    data-testid="input-new-step"
                  />
                  <Button type="button" onClick={addStep} data-testid="button-add-step">
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowForm(false)
                setEditingRoadmap(null)
              }}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-roadmap">
                {editingRoadmap ? 'Update' : 'Create'} Roadmap
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingRoadmap} onOpenChange={(open) => !open && setViewingRoadmap(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingRoadmap?.title}</DialogTitle>
          </DialogHeader>
          {viewingRoadmap && (
            <div className="space-y-4">
              {viewingRoadmap.description && (
                <p className="text-sm text-muted-foreground">{viewingRoadmap.description}</p>
              )}
              <div className="space-y-2">
                <Label>Progress</Label>
                <div className="space-y-2">
                  {viewingRoadmap.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                    >
                      <Checkbox
                        checked={step.isCompleted}
                        onCheckedChange={(checked) => {
                          updateStepMutation.mutate({
                            id: step.id,
                            isCompleted: checked as boolean,
                          })
                        }}
                        data-testid={`checkbox-step-${step.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${step.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {step.title}
                        </p>
                        {step.description && (
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    openEditDialog(viewingRoadmap)
                    setViewingRoadmap(null)
                  }}
                  data-testid={`button-edit-roadmap-${viewingRoadmap.id}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Roadmap
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeletingRoadmap(viewingRoadmap)}
                  data-testid={`button-delete-roadmap-${viewingRoadmap.id}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Roadmap
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRoadmap} onOpenChange={(open) => !open && setDeletingRoadmap(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingRoadmap?.title}" and all its steps. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRoadmap && deleteRoadmapMutation.mutate(deletingRoadmap.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
