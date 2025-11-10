import { JournalEntry } from "@/components/journal-entry"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Journal() {
  // TODO: Remove mock data - replace with actual API calls
  const mockEntries = [
    {
      id: '1',
      date: new Date(2025, 10, 10),
      mood: 'happy' as const,
      content: 'Great progress today! Completed 3 LeetCode problems and finished the React hooks module. Feeling confident about the upcoming placement season. Also had a productive study session with friends.',
    },
    {
      id: '2',
      date: new Date(2025, 10, 9),
      mood: 'neutral' as const,
      content: 'Mixed day. Struggled with some DSA concepts but made progress on my side project. Need to allocate more time for debugging.',
    },
    {
      id: '3',
      date: new Date(2025, 10, 8),
      mood: 'sad' as const,
      content: 'Challenging day with deadlines piling up. Couldn\'t maintain my coding habit streak. Need to reset and refocus tomorrow.',
    },
    {
      id: '4',
      date: new Date(2025, 10, 7),
      mood: 'happy' as const,
      content: 'Productive weekend! Finished two major modules from my roadmap. The concepts are starting to click. Excited to build my portfolio project next week.',
    },
    {
      id: '5',
      date: new Date(2025, 10, 6),
      mood: 'neutral' as const,
      content: 'Regular day of classes and self-study. Watched some Striver videos on graph algorithms. Need to practice more problems to solidify understanding.',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Journal</h1>
          <p className="text-muted-foreground">
            Reflect on your journey and track your thoughts
          </p>
        </div>
        <Button data-testid="button-create-journal">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="space-y-4">
        {mockEntries.map((entry) => (
          <JournalEntry
            key={entry.id}
            {...entry}
            onClick={() => console.log('Open journal entry', entry.id)}
          />
        ))}
      </div>
    </div>
  )
}
