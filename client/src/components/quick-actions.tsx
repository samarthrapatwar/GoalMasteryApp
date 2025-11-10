import { Button } from "@/components/ui/button"
import { Plus, Target, CheckSquare, BookOpen, Map } from "lucide-react"

interface QuickAction {
  icon: typeof Target
  label: string
  onClick: () => void
  testId: string
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      icon: Target,
      label: "New Goal",
      onClick: () => console.log("Create new goal"),
      testId: "button-new-goal",
    },
    {
      icon: CheckSquare,
      label: "Add Habit",
      onClick: () => console.log("Add new habit"),
      testId: "button-new-habit",
    },
    {
      icon: BookOpen,
      label: "Write Entry",
      onClick: () => console.log("Create journal entry"),
      testId: "button-new-journal",
    },
    {
      icon: Map,
      label: "Build Roadmap",
      onClick: () => console.log("Create new roadmap"),
      testId: "button-new-roadmap",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={action.onClick}
            data-testid={action.testId}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{action.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
