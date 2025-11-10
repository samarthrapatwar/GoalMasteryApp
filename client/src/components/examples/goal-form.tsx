import { GoalForm } from '../goal-form'

export default function GoalFormExample() {
  return (
    <div className="p-6 max-w-2xl">
      <GoalForm
        onSubmit={(goal) => console.log('Goal created:', goal)}
        onCancel={() => console.log('Form cancelled')}
      />
    </div>
  )
}
