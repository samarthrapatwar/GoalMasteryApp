# Personal Goal Mastery App (PGMA) - Design Guidelines

## Design Approach

**Selected System:** Linear + Material Design Hybrid
- **Justification:** Linear's clean, productivity-focused aesthetic combined with Material Design's robust data visualization patterns perfectly suits a goal management application requiring both efficiency and visual clarity
- **Key Principles:** Information hierarchy, scannable layouts, purposeful whitespace, data-first design, immediate clarity

## Typography

**Font System:**
- **Primary:** Inter (via Google Fonts CDN)
  - Headings: 600-700 weight
  - Body: 400-500 weight
- **Monospace:** JetBrains Mono for data/metrics display

**Type Scale:**
- Page titles: text-3xl (30px) / font-semibold
- Section headers: text-2xl (24px) / font-semibold
- Card titles: text-lg (18px) / font-medium
- Body text: text-base (16px) / font-normal
- Helper text: text-sm (14px) / font-normal
- Metrics/stats: text-4xl (36px) / font-bold (monospace)

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Page margins: px-6 md:px-12
- Card spacing: p-6

**Grid Structure:**
- Dashboard: 12-column grid with responsive breakpoints
- Sidebar: Fixed 280px width on desktop, collapsible on mobile
- Main content: max-w-7xl container with px-6 padding
- Widget cards: Grid of 2-4 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## Component Library

### Navigation
- **Top Bar:** Fixed header with app logo, global search, notifications icon, user avatar
- **Sidebar:** Vertical navigation with icons + labels, active state with accent border-left, collapsible on mobile
- **Breadcrumbs:** For deep navigation in roadmaps/nested goals

### Dashboard Widgets
- **Stat Cards:** Metric number (large), label, mini trend indicator, subtle border
- **Progress Cards:** Title, progress bar with percentage, time remaining, CTA button
- **Streak Calendar:** Heatmap grid showing habit completion (similar to GitHub contributions)
- **Quick Actions:** Icon buttons for "Add Goal", "Log Habit", "New Entry"

### Data Display
- **Goal Cards:** Kanban-style with drag handles, priority indicator (dot), progress bar, due date, category badge
- **Habit List:** Checkbox, habit name, streak count, last completion timestamp
- **Timeline View:** Vertical timeline with milestone markers for roadmap visualization
- **Analytics Charts:** Line/bar charts using clean geometric shapes, gridlines, clear legends

### Forms & Inputs
- **Input Fields:** Border-based (not filled), clear labels above, helper text below, focus state with border accent
- **Dropdowns:** Native styled selects with custom chevron icon
- **Date Pickers:** Calendar overlay with today highlight
- **Priority Selector:** Radio buttons with visual indicators (High: red dot, Medium: yellow, Low: blue)
- **Text Areas:** For journal entries and goal descriptions, auto-resize
- **Toggle Switches:** For habit check-ins and settings

### Modals & Overlays
- **Modal Dialogs:** Centered overlay with backdrop blur, max-width-2xl, clear header/body/footer sections
- **Side Panels:** Slide-in from right for quick edits (600px width)
- **Toasts:** Top-right notifications for success/error states

### Calendars
- **Week/Month Views:** Grid layout with event blocks, time slots, color-coded by category
- **Drag-and-Drop:** Visual feedback on hover/drag for routine scheduling

### Buttons & Actions
- **Primary:** Solid fill, rounded-lg, px-4 py-2, medium font weight
- **Secondary:** Border outline, transparent background
- **Icon Buttons:** Square with icon, subtle hover background
- **Floating Action Button:** Bottom-right for quick goal creation

## Special Features

### Roadmap Builder
- **Node-Based Layout:** Circular nodes connected with lines, drag-and-drop positioning
- **Resource Links:** Icon-based previews for YouTube/docs embedded in nodes
- **Progress Overlay:** Semi-transparent completion overlay on completed steps

### Journal Interface
- **Minimalist Editor:** Clean text area with subtle toolbar (bold/italic/lists)
- **Mood Selector:** Emoji-based quick selection at entry top
- **Date Navigation:** Left sidebar calendar for browsing past entries

### Analytics Dashboard
- **Chart Grid:** 2-column layout for side-by-side comparisons
- **Time Range Selector:** Tabs for Week/Month/Year views
- **Export Options:** Subtle icon buttons for PDF/CSV download

## Images

**Hero Section:** No traditional hero - dashboard is the entry point
**Motivational Imagery:** 
- Dashboard background: Optional subtle gradient or abstract pattern (very low opacity)
- Empty states: Simple illustrations for "No goals yet" or "Start your first habit"
- Achievement badges: Icon-based milestone graphics (100-day streak, etc.)

**Placement:**
- Empty state illustrations: Center of empty lists/calendars
- User avatar: Top-right in navigation
- Achievement icons: In notifications and habit completion modals

## Animations

**Minimal Approach:**
- Smooth transitions for sidebar collapse/expand (200ms)
- Progress bar fill animations on load (300ms ease)
- Modal fade-in/slide-up (150ms)
- Card hover lift (subtle 2px translate-y)
- No scroll-triggered animations
- No autoplay carousels

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for icon buttons
- Focus indicators with 2px offset ring
- Form validation with inline error messages
- High contrast text ratios (WCAG AA minimum)