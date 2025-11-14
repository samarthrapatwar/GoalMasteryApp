import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { insertGoalSchema, type InsertGoal } from "@shared/schema"
import { format } from "date-fns"
import type { Goal } from "@shared/schema"

interface GoalFormProps {
  initialValues?: Goal
  onSubmit?: (goal: GoalFormData) => void
  onCancel?: () => void
  isPending?: boolean
}

export type GoalFormData = InsertGoal

export function GoalForm({ initialValues, onSubmit, onCancel, isPending }: GoalFormProps) {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(insertGoalSchema),
    defaultValues: initialValues ? {
      title: initialValues.title,
      description: initialValues.description,
      category: initialValues.category,
      priority: initialValues.priority,
      deadline: typeof initialValues.deadline === 'string' 
        ? initialValues.deadline 
        : format(new Date(initialValues.deadline), 'yyyy-MM-dd'),
      progress: initialValues.progress,
      status: initialValues.status,
    } : {
      title: "",
      description: "",
      category: "Tech",
      priority: "medium",
      deadline: format(new Date(), 'yyyy-MM-dd'),
      progress: 0,
      status: "active",
    },
  })

  const handleSubmit = (data: GoalFormData) => {
    onSubmit?.(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter goal title"
                  data-testid="input-goal-title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your goal"
                  data-testid="input-goal-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-goal-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Skills">Skills</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="Habits">Habits</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-goal-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  data-testid="input-goal-deadline"
                  {...field}
                  value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} data-testid="button-submit">
            {isPending ? "Saving..." : initialValues ? "Update Goal" : "Create Goal"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
