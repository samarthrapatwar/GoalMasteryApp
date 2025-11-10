import { UpcomingDeadlines } from '../upcoming-deadlines'

export default function UpcomingDeadlinesExample() {
  const deadlines = [
    {
      id: '1',
      title: 'Complete React Course',
      type: 'goal' as const,
      date: new Date(2025, 10, 12),
    },
    {
      id: '2',
      title: 'Submit DSA Assignment',
      type: 'goal' as const,
      date: new Date(2025, 10, 15),
    },
    {
      id: '3',
      title: 'Weekly Review',
      type: 'routine' as const,
      date: new Date(2025, 10, 17),
    },
    {
      id: '4',
      title: 'Project Demo',
      type: 'goal' as const,
      date: new Date(2025, 10, 20),
    },
  ]

  return (
    <div className="p-6 max-w-md">
      <UpcomingDeadlines deadlines={deadlines} />
    </div>
  )
}
