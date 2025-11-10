import { JournalEntry } from '../journal-entry'

export default function JournalEntryExample() {
  return (
    <div className="space-y-4 p-6 max-w-3xl">
      <JournalEntry
        id="1"
        date={new Date(2025, 10, 10)}
        mood="happy"
        content="Great progress today! Completed 3 LeetCode problems and finished the React hooks module. Feeling confident about the upcoming placement season. Also had a productive study session with friends."
        onClick={() => console.log('Open journal entry 1')}
      />
      <JournalEntry
        id="2"
        date={new Date(2025, 10, 9)}
        mood="neutral"
        content="Mixed day. Struggled with some DSA concepts but made progress on my side project. Need to allocate more time for debugging."
        onClick={() => console.log('Open journal entry 2')}
      />
      <JournalEntry
        id="3"
        date={new Date(2025, 10, 8)}
        mood="sad"
        content="Challenging day with deadlines piling up. Couldn't maintain my coding habit streak. Need to reset and refocus tomorrow."
        onClick={() => console.log('Open journal entry 3')}
      />
    </div>
  )
}
