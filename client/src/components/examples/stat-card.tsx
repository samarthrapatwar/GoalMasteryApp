import { StatCard } from '../stat-card'
import { Target, CheckSquare, Flame, TrendingUp } from 'lucide-react'

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatCard 
        title="Active Goals" 
        value={12} 
        icon={Target}
        trend={{ value: 20, positive: true }}
      />
      <StatCard 
        title="Habits Tracked" 
        value={8} 
        icon={CheckSquare}
        trend={{ value: 14, positive: true }}
      />
      <StatCard 
        title="Current Streak" 
        value="15 days" 
        icon={Flame}
      />
      <StatCard 
        title="Completion Rate" 
        value="78%" 
        icon={TrendingUp}
        trend={{ value: 12, positive: true }}
      />
    </div>
  )
}
