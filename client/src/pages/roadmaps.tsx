import { RoadmapCard } from "@/components/roadmap-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Roadmaps() {
  // TODO: Remove mock data - replace with actual API calls
  const mockRoadmaps = [
    {
      id: '1',
      title: 'Full-Stack Developer',
      steps: [
        { id: '1', title: 'HTML & CSS Basics', completed: true },
        { id: '2', title: 'JavaScript Fundamentals', completed: true },
        { id: '3', title: 'React.js', completed: false },
        { id: '4', title: 'Node.js & Express', completed: false },
        { id: '5', title: 'Database (MongoDB)', completed: false },
        { id: '6', title: 'Build 3 Projects', completed: false },
      ],
    },
    {
      id: '2',
      title: 'DSA Mastery',
      steps: [
        { id: '1', title: 'Arrays & Strings', completed: true },
        { id: '2', title: 'Linked Lists', completed: true },
        { id: '3', title: 'Stacks & Queues', completed: true },
        { id: '4', title: 'Trees & Graphs', completed: false },
        { id: '5', title: 'Dynamic Programming', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      steps: [
        { id: '1', title: 'Python for ML', completed: true },
        { id: '2', title: 'Linear Algebra Basics', completed: false },
        { id: '3', title: 'Pandas & NumPy', completed: false },
        { id: '4', title: 'Scikit-learn', completed: false },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Roadmaps</h1>
          <p className="text-muted-foreground">
            Create and follow structured learning paths
          </p>
        </div>
        <Button data-testid="button-create-roadmap">
          <Plus className="h-4 w-4 mr-2" />
          New Roadmap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRoadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            {...roadmap}
            onView={() => console.log('View roadmap', roadmap.id)}
          />
        ))}
      </div>
    </div>
  )
}
