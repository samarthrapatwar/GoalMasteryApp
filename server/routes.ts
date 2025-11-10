// Based on javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertGoalSchema,
  insertHabitSchema,
  insertHabitCheckInSchema,
  insertRoutineSchema,
  insertRoadmapSchema,
  insertRoadmapStepSchema,
  insertJournalEntrySchema,
  updateGoalSchema,
  updateHabitSchema,
  updateRoutineSchema,
  updateRoadmapSchema,
  updateRoadmapStepSchema,
  updateJournalEntrySchema,
} from "@shared/schema";
import { format, subDays, startOfDay } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Goal routes
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getGoalsByUserId(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createGoal(validated);
      res.status(201).json(goal);
    } catch (error: any) {
      console.error("Error creating goal:", error);
      res.status(400).json({ message: error.message || "Failed to create goal" });
    }
  });

  app.patch('/api/goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.getGoal(id);
      
      if (!goal || goal.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Goal not found" });
      }

      const validated = updateGoalSchema.parse(req.body);
      const updated = await storage.updateGoal(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating goal:", error);
      res.status(400).json({ message: error.message || "Failed to update goal" });
    }
  });

  app.delete('/api/goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.getGoal(id);
      
      if (!goal || goal.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Goal not found" });
      }

      await storage.deleteGoal(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Habit routes
  app.get('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const habits = await storage.getHabitsByUserId(userId);
      
      // Get today's check-ins for each habit
      const today = format(new Date(), 'yyyy-MM-dd');
      const habitsWithStatus = await Promise.all(
        habits.map(async (habit) => {
          const checkIns = await storage.getHabitCheckIns(habit.id!, today, today);
          return {
            ...habit,
            completed: checkIns.length > 0,
          };
        })
      );
      
      res.json(habitsWithStatus);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post('/api/habits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertHabitSchema.parse({ ...req.body, userId });
      const habit = await storage.createHabit(validated);
      res.status(201).json(habit);
    } catch (error: any) {
      console.error("Error creating habit:", error);
      res.status(400).json({ message: error.message || "Failed to create habit" });
    }
  });

  app.patch('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.getHabit(id);
      
      if (!habit || habit.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Habit not found" });
      }

      const validated = updateHabitSchema.parse(req.body);
      const updated = await storage.updateHabit(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating habit:", error);
      res.status(400).json({ message: error.message || "Failed to update habit" });
    }
  });

  app.delete('/api/habits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.getHabit(id);
      
      if (!habit || habit.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Habit not found" });
      }

      await storage.deleteHabit(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Habit check-in routes
  app.post('/api/habits/:id/check-in', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.getHabit(id);
      
      if (!habit || habit.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Habit not found" });
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Check if already checked in today
      const existingCheckIns = await storage.getHabitCheckIns(id, today, today);
      if (existingCheckIns.length > 0) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      const validated = insertHabitCheckInSchema.parse({
        habitId: id,
        completedAt: today,
        notes: req.body.notes,
      });

      const checkIn = await storage.createHabitCheckIn(validated);
      
      // Update streak
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      const yesterdayCheckIns = await storage.getHabitCheckIns(id, yesterday, yesterday);
      
      const newStreak = yesterdayCheckIns.length > 0 ? habit.currentStreak + 1 : 1;
      const longestStreak = Math.max(newStreak, habit.longestStreak);
      
      await storage.updateHabit(id, {
        currentStreak: newStreak,
        longestStreak,
      });

      res.status(201).json(checkIn);
    } catch (error: any) {
      console.error("Error checking in habit:", error);
      res.status(400).json({ message: error.message || "Failed to check in habit" });
    }
  });

  // Routine routes
  app.get('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routines = await storage.getRoutinesByUserId(userId);
      res.json(routines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Failed to fetch routines" });
    }
  });

  app.post('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertRoutineSchema.parse({ ...req.body, userId });
      const routine = await storage.createRoutine(validated);
      res.status(201).json(routine);
    } catch (error: any) {
      console.error("Error creating routine:", error);
      res.status(400).json({ message: error.message || "Failed to create routine" });
    }
  });

  app.patch('/api/routines/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const routine = await storage.getRoutine(id);
      
      if (!routine || routine.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Routine not found" });
      }

      const validated = updateRoutineSchema.parse(req.body);
      const updated = await storage.updateRoutine(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating routine:", error);
      res.status(400).json({ message: error.message || "Failed to update routine" });
    }
  });

  app.delete('/api/routines/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const routine = await storage.getRoutine(id);
      
      if (!routine || routine.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Routine not found" });
      }

      await storage.deleteRoutine(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting routine:", error);
      res.status(500).json({ message: "Failed to delete routine" });
    }
  });

  // Roadmap routes
  app.get('/api/roadmaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      
      // Get steps for each roadmap
      const roadmapsWithSteps = await Promise.all(
        roadmaps.map(async (roadmap) => {
          const steps = await storage.getRoadmapSteps(roadmap.id);
          return { ...roadmap, steps };
        })
      );
      
      res.json(roadmapsWithSteps);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.post('/api/roadmaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { steps, ...roadmapData } = req.body;
      const validated = insertRoadmapSchema.parse({ ...roadmapData, userId });
      const roadmap = await storage.createRoadmap(validated);
      
      // Create steps if provided
      if (steps && Array.isArray(steps)) {
        const createdSteps = await Promise.all(
          steps.map((step: any, index: number) => {
            const stepValidated = insertRoadmapStepSchema.parse({
              ...step,
              roadmapId: roadmap.id,
              orderIndex: index,
            });
            return storage.createRoadmapStep(stepValidated);
          })
        );
        
        return res.status(201).json({ ...roadmap, steps: createdSteps });
      }
      
      res.status(201).json({ ...roadmap, steps: [] });
    } catch (error: any) {
      console.error("Error creating roadmap:", error);
      res.status(400).json({ message: error.message || "Failed to create roadmap" });
    }
  });

  app.patch('/api/roadmaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const roadmap = await storage.getRoadmap(id);
      
      if (!roadmap || roadmap.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      const validated = updateRoadmapSchema.parse(req.body);
      const updated = await storage.updateRoadmap(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating roadmap:", error);
      res.status(400).json({ message: error.message || "Failed to update roadmap" });
    }
  });

  app.delete('/api/roadmaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const roadmap = await storage.getRoadmap(id);
      
      if (!roadmap || roadmap.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      await storage.deleteRoadmap(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      res.status(500).json({ message: "Failed to delete roadmap" });
    }
  });

  // Roadmap step routes
  app.patch('/api/roadmap-steps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const step = await storage.getRoadmapStep(id);
      
      if (!step) {
        return res.status(404).json({ message: "Roadmap step not found" });
      }

      const roadmap = await storage.getRoadmap(step.roadmapId);
      if (!roadmap || roadmap.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Roadmap step not found" });
      }

      const validated = updateRoadmapStepSchema.parse(req.body);
      const updated = await storage.updateRoadmapStep(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating roadmap step:", error);
      res.status(400).json({ message: error.message || "Failed to update roadmap step" });
    }
  });

  // Journal routes
  app.get('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getJournalEntriesByUserId(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertJournalEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createJournalEntry(validated);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error("Error creating journal entry:", error);
      res.status(400).json({ message: error.message || "Failed to create journal entry" });
    }
  });

  app.patch('/api/journal/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getJournalEntry(id);
      
      if (!entry || entry.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Journal entry not found" });
      }

      const validated = updateJournalEntrySchema.parse(req.body);
      const updated = await storage.updateJournalEntry(id, validated);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating journal entry:", error);
      res.status(400).json({ message: error.message || "Failed to update journal entry" });
    }
  });

  app.delete('/api/journal/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getJournalEntry(id);
      
      if (!entry || entry.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Journal entry not found" });
      }

      await storage.deleteJournalEntry(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Analytics route
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get all user data
      const [goals, habits, journalEntries] = await Promise.all([
        storage.getGoalsByUserId(userId),
        storage.getHabitsByUserId(userId),
        storage.getJournalEntriesByUserId(userId),
      ]);

      // Calculate statistics
      const activeGoals = goals.filter(g => g.status === 'active').length;
      const completedGoals = goals.filter(g => g.status === 'completed').length;
      const totalGoals = goals.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      // Calculate habit statistics
      const today = format(new Date(), 'yyyy-MM-dd');
      const habitsCompletedToday = await Promise.all(
        habits.map(async (habit) => {
          const checkIns = await storage.getHabitCheckIns(habit.id!, today, today);
          return checkIns.length > 0;
        })
      );
      const completedHabitsCount = habitsCompletedToday.filter(Boolean).length;

      const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

      res.json({
        goals: {
          total: totalGoals,
          active: activeGoals,
          completed: completedGoals,
          completionRate,
        },
        habits: {
          total: habits.length,
          completedToday: completedHabitsCount,
          longestStreak,
        },
        journal: {
          totalEntries: journalEntries.length,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
