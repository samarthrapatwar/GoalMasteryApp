import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { JournalEntry as JournalEntryComponent, type Mood } from "@/components/journal-entry"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { isUnauthorizedError } from "@/lib/authUtils"
import type { JournalEntry } from "@shared/schema"
import { format } from "date-fns"

interface JournalFormData {
  content: string
  mood: Mood
  entryDate: string
}

export default function Journal() {
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(null)
  const [formData, setFormData] = useState<JournalFormData>({
    content: "",
    mood: "neutral",
    entryDate: format(new Date(), 'yyyy-MM-dd'),
  })
  const { toast } = useToast()

  const { data: entries = [], isLoading, isError, error } = useQuery<JournalEntry[]>({
    queryKey: ['/api/journal'],
  })

  const createEntryMutation = useMutation({
    mutationFn: async (data: JournalFormData) => {
      return await apiRequest('/api/journal', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setShowForm(false)
      setFormData({ content: "", mood: "neutral", entryDate: format(new Date(), 'yyyy-MM-dd') })
      toast({
        title: "Success",
        description: "Journal entry created successfully",
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
        description: error.message || "Failed to create journal entry",
        variant: "destructive",
      })
    },
  })

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JournalFormData }) => {
      return await apiRequest(`/api/journal/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] })
      setEditingEntry(null)
      toast({
        title: "Success",
        description: "Journal entry updated successfully",
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
        description: error.message || "Failed to update journal entry",
        variant: "destructive",
      })
    },
  })

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/journal/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal'] })
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] })
      setDeletingEntry(null)
      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
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
        description: error.message || "Failed to delete journal entry",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, data: formData })
    } else {
      createEntryMutation.mutate(formData)
    }
  }

  const openEditDialog = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setFormData({
      content: entry.content,
      mood: entry.mood as Mood,
      entryDate: entry.entryDate,
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
            Failed to load journal entries: {(error as Error).message}
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
          <h1 className="text-3xl font-semibold mb-2">Journal</h1>
          <p className="text-muted-foreground">
            Reflect on your journey and track your thoughts
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-create-journal">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalEntryComponent
              key={entry.id}
              id={entry.id}
              date={new Date(entry.entryDate)}
              mood={entry.mood as Mood}
              content={entry.content}
              onClick={() => openEditDialog(entry)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <p className="text-muted-foreground text-center">
            No journal entries yet. Start reflecting on your journey today!
          </p>
        </Card>
      )}

      <Dialog open={showForm || !!editingEntry} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false)
          setEditingEntry(null)
          setFormData({ content: "", mood: "neutral", entryDate: format(new Date(), 'yyyy-MM-dd') })
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Journal Entry' : 'Create New Journal Entry'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entryDate">Date</Label>
              <Input
                id="entryDate"
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                data-testid="input-journal-date"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select
                value={formData.mood}
                onValueChange={(value) => setFormData({ ...formData, mood: value as Mood })}
              >
                <SelectTrigger id="mood" data-testid="select-journal-mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                data-testid="input-journal-content"
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="flex justify-between gap-2">
              {editingEntry && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setEditingEntry(null)
                    setDeletingEntry(editingEntry)
                  }}
                  data-testid="button-delete-entry"
                >
                  Delete Entry
                </Button>
              )}
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false)
                  setEditingEntry(null)
                }}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit-journal">
                  {editingEntry ? 'Update' : 'Create'} Entry
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this journal entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEntry && deleteEntryMutation.mutate(deletingEntry.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
