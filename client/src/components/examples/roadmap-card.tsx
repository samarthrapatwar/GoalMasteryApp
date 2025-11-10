import { RoadmapCard } from '../roadmap-card'

export default function RoadmapCardExample() {
  const fullStackSteps = [
    { id: '1', title: 'HTML & CSS Basics', completed: true },
    { id: '2', title: 'JavaScript Fundamentals', completed: true },
    { id: '3', title: 'React.js', completed: false },
    { id: '4', title: 'Node.js & Express', completed: false },
    { id: '5', title: 'Database (MongoDB)', completed: false },
    { id: '6', title: 'Build 3 Projects', completed: false },
  ]

  const dsaSteps = [
    { id: '1', title: 'Arrays & Strings', completed: true },
    { id: '2', title: 'Linked Lists', completed: true },
    { id: '3', title: 'Stacks & Queues', completed: true },
    { id: '4', title: 'Trees & Graphs', completed: false },
    { id: '5', title: 'Dynamic Programming', completed: false },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <RoadmapCard
        id="1"
        title="Full-Stack Developer"
        steps={fullStackSteps}
        onView={() => console.log('View Full-Stack roadmap')}
      />
      <RoadmapCard
        id="2"
        title="DSA Mastery"
        steps={dsaSteps}
        onView={() => console.log('View DSA roadmap')}
      />
    </div>
  )
}
