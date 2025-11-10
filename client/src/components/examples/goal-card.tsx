import { GoalCard } from '../goal-card'

export default function GoalCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <GoalCard
        id="1"
        title="Complete React Advanced Course"
        description="Finish all modules of the Meta React advanced certification"
        category="Tech"
        priority="high"
        progress={65}
        deadline={new Date(2025, 11, 15)}
        onEdit={() => console.log('Edit goal 1')}
      />
      <GoalCard
        id="2"
        title="Solve 50 LeetCode Problems"
        description="Practice DSA for placement preparation"
        category="Skills"
        priority="high"
        progress={42}
        deadline={new Date(2025, 11, 30)}
        onEdit={() => console.log('Edit goal 2')}
      />
      <GoalCard
        id="3"
        title="Read Tech Book Monthly"
        description="Complete one technical book each month"
        category="Personal"
        priority="medium"
        progress={80}
        deadline={new Date(2025, 10, 30)}
        onEdit={() => console.log('Edit goal 3')}
      />
    </div>
  )
}
