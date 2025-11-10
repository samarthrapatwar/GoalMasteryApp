import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Learning to write programs stretches your mind, and helps you think better.",
    author: "Bill Gates"
  },
  {
    text: "The best way to predict the future is to implement it.",
    author: "David Heinemeier Hansson"
  },
]

export function MotivationalQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-chart-1/10 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Quote className="h-8 w-8 text-primary/60" />
          <blockquote className="text-lg font-medium italic">
            "{quote.text}"
          </blockquote>
          <p className="text-sm text-muted-foreground">
            — {quote.author}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
