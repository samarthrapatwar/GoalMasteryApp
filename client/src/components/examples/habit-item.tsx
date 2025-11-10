import { HabitItem } from '../habit-item'

export default function HabitItemExample() {
  return (
    <div className="space-y-3 p-6 max-w-2xl">
      <HabitItem
        id="1"
        name="Code for 1 hour"
        streak={15}
        completed={true}
        frequency="daily"
        onToggle={(checked) => console.log('Habit 1 toggled:', checked)}
      />
      <HabitItem
        id="2"
        name="Solve 2 DSA problems"
        streak={7}
        completed={false}
        frequency="daily"
        onToggle={(checked) => console.log('Habit 2 toggled:', checked)}
      />
      <HabitItem
        id="3"
        name="Review notes"
        streak={3}
        completed={false}
        frequency="weekly"
        onToggle={(checked) => console.log('Habit 3 toggled:', checked)}
      />
    </div>
  )
}
