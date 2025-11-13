import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  goals,
  habits,
  habitCheckIns,
  routines,
  roadmaps,
  roadmapSteps,
  journalEntries,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type Habit,
  type InsertHabit,
  type HabitCheckIn,
  type InsertHabitCheckIn,
  type Routine,
  type InsertRoutine,
  type Roadmap,
  type InsertRoadmap,
  type RoadmapStep,
  type InsertRoadmapStep,
  type JournalEntry,
  type InsertJournalEntry,
} from "@shared/schema";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Goal operations
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoalsByUserId(userId: string): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;

  // Habit operations
  createHabit(habit: InsertHabit): Promise<Habit>;
  getHabitsByUserId(userId: string): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  
  // Habit check-in operations
  createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn>;
  getHabitCheckIns(habitId: string, startDate?: string, endDate?: string): Promise<HabitCheckIn[]>;
  
  // Routine operations
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  getRoutinesByUserId(userId: string): Promise<Routine[]>;
  getRoutine(id: string): Promise<Routine | undefined>;
  updateRoutine(id: string, updates: Partial<InsertRoutine>): Promise<Routine>;
  deleteRoutine(id: string): Promise<void>;

  // Roadmap operations
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmapsByUserId(userId: string): Promise<Roadmap[]>;
  getRoadmap(id: string): Promise<Roadmap | undefined>;
  updateRoadmap(id: string, updates: Partial<InsertRoadmap>): Promise<Roadmap>;
  deleteRoadmap(id: string): Promise<void>;
  
  // Roadmap step operations
  createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep>;
  getRoadmapSteps(roadmapId: string): Promise<RoadmapStep[]>;
  getRoadmapStep(id: string): Promise<RoadmapStep | undefined>;
  updateRoadmapStep(id: string, updates: Partial<InsertRoadmapStep>): Promise<RoadmapStep>;
  deleteRoadmapStep(id: string): Promise<void>;

  // Journal operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private goals: Map<string, Goal> = new Map();
  private habits: Map<string, Habit> = new Map();
  private habitCheckIns: Map<string, HabitCheckIn> = new Map();
  private routines: Map<string, Routine> = new Map();
  private roadmaps: Map<string, Roadmap> = new Map();
  private roadmapSteps: Map<string, RoadmapStep> = new Map();
  private journalEntries: Map<string, JournalEntry> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id ?? this.generateId();
    const existing = this.users.get(userId);
    const user: User = {
      id: userId,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Goal operations
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const created: Goal = {
      id: this.generateId(),
      ...goal,
      status: goal.status ?? "active",
      progress: goal.progress ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.set(created.id, created);
    return created;
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(g => g.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal> {
    const existing = this.goals.get(id);
    if (!existing) throw new Error("Goal not found");
    const updated: Goal = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals.delete(id);
  }

  // Habit operations
  async createHabit(habit: InsertHabit): Promise<Habit> {
    const created: Habit = {
      id: this.generateId(),
      ...habit,
      isActive: habit.isActive ?? true,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date(),
    };
    this.habits.set(created.id, created);
    return created;
  }

  async getHabitsByUserId(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(h => h.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>): Promise<Habit> {
    const existing = this.habits.get(id);
    if (!existing) throw new Error("Habit not found");
    const updated: Habit = {
      ...existing,
      ...updates,
    };
    this.habits.set(id, updated);
    return updated;
  }

  async deleteHabit(id: string): Promise<void> {
    this.habits.delete(id);
    Array.from(this.habitCheckIns.values())
      .filter(c => c.habitId === id)
      .forEach(c => this.habitCheckIns.delete(c.id));
  }

  // Habit check-in operations
  async createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn> {
    const created: HabitCheckIn = {
      id: this.generateId(),
      ...checkIn,
      notes: checkIn.notes ?? null,
    };
    this.habitCheckIns.set(created.id, created);
    return created;
  }

  async getHabitCheckIns(habitId: string, startDate?: string, endDate?: string): Promise<HabitCheckIn[]> {
    let checkIns = Array.from(this.habitCheckIns.values())
      .filter(c => c.habitId === habitId);
    
    if (startDate && endDate) {
      checkIns = checkIns.filter(c => 
        c.completedAt >= startDate && c.completedAt <= endDate
      );
    }
    
    return checkIns.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  // Routine operations
  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const created: Routine = {
      id: this.generateId(),
      ...routine,
      isRecurring: routine.isRecurring ?? false,
      daysOfWeek: routine.daysOfWeek ?? null,
      createdAt: new Date(),
    };
    this.routines.set(created.id, created);
    return created;
  }

  async getRoutinesByUserId(userId: string): Promise<Routine[]> {
    return Array.from(this.routines.values())
      .filter(r => r.userId === userId);
  }

  async getRoutine(id: string): Promise<Routine | undefined> {
    return this.routines.get(id);
  }

  async updateRoutine(id: string, updates: Partial<InsertRoutine>): Promise<Routine> {
    const existing = this.routines.get(id);
    if (!existing) throw new Error("Routine not found");
    const updated: Routine = {
      ...existing,
      ...updates,
    };
    this.routines.set(id, updated);
    return updated;
  }

  async deleteRoutine(id: string): Promise<void> {
    this.routines.delete(id);
  }

  // Roadmap operations
  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const created: Roadmap = {
      id: this.generateId(),
      ...roadmap,
      description: roadmap.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roadmaps.set(created.id, created);
    return created;
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async updateRoadmap(id: string, updates: Partial<InsertRoadmap>): Promise<Roadmap> {
    const existing = this.roadmaps.get(id);
    if (!existing) throw new Error("Roadmap not found");
    const updated: Roadmap = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.roadmaps.set(id, updated);
    return updated;
  }

  async deleteRoadmap(id: string): Promise<void> {
    this.roadmaps.delete(id);
    Array.from(this.roadmapSteps.values())
      .filter(s => s.roadmapId === id)
      .forEach(s => this.roadmapSteps.delete(s.id));
  }

  // Roadmap step operations
  async createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep> {
    const created: RoadmapStep = {
      id: this.generateId(),
      ...step,
      description: step.description ?? null,
      isCompleted: step.isCompleted ?? false,
      resourceLinks: step.resourceLinks ?? null,
      completedAt: null,
    };
    this.roadmapSteps.set(created.id, created);
    return created;
  }

  async getRoadmapSteps(roadmapId: string): Promise<RoadmapStep[]> {
    return Array.from(this.roadmapSteps.values())
      .filter(s => s.roadmapId === roadmapId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getRoadmapStep(id: string): Promise<RoadmapStep | undefined> {
    return this.roadmapSteps.get(id);
  }

  async updateRoadmapStep(id: string, updates: Partial<InsertRoadmapStep>): Promise<RoadmapStep> {
    const existing = this.roadmapSteps.get(id);
    if (!existing) throw new Error("Roadmap step not found");
    const updated: RoadmapStep = {
      ...existing,
      ...updates,
    };
    this.roadmapSteps.set(id, updated);
    return updated;
  }

  async deleteRoadmapStep(id: string): Promise<void> {
    this.roadmapSteps.delete(id);
  }

  // Journal operations
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const created: JournalEntry = {
      id: this.generateId(),
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.journalEntries.set(created.id, created);
    return created;
  }

  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(e => e.userId === userId)
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate));
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry> {
    const existing = this.journalEntries.get(id);
    if (!existing) throw new Error("Journal entry not found");
    const updated: JournalEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.journalEntries.set(id, updated);
    return updated;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    this.journalEntries.delete(id);
  }
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [created] = await db.insert(goals).values(goal).returning();
    return created;
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.createdAt));
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal> {
    const [updated] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    if (!updated) throw new Error("Goal not found");
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values(habit).returning();
    return created;
  }

  async getHabitsByUserId(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>): Promise<Habit> {
    const [updated] = await db
      .update(habits)
      .set(updates)
      .where(eq(habits.id, id))
      .returning();
    if (!updated) throw new Error("Habit not found");
    return updated;
  }

  async deleteHabit(id: string): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  async createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn> {
    const [created] = await db.insert(habitCheckIns).values(checkIn).returning();
    return created;
  }

  async getHabitCheckIns(habitId: string, startDate?: string, endDate?: string): Promise<HabitCheckIn[]> {
    let query = db.select().from(habitCheckIns).where(eq(habitCheckIns.habitId, habitId));
    
    if (startDate && endDate) {
      const conditions = and(
        eq(habitCheckIns.habitId, habitId),
        gte(habitCheckIns.completedAt, startDate),
        lte(habitCheckIns.completedAt, endDate)
      );
      return await db
        .select()
        .from(habitCheckIns)
        .where(conditions)
        .orderBy(desc(habitCheckIns.completedAt));
    }
    
    return await query.orderBy(desc(habitCheckIns.completedAt));
  }

  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const [created] = await db.insert(routines).values(routine).returning();
    return created;
  }

  async getRoutinesByUserId(userId: string): Promise<Routine[]> {
    return await db.select().from(routines).where(eq(routines.userId, userId));
  }

  async getRoutine(id: string): Promise<Routine | undefined> {
    const [routine] = await db.select().from(routines).where(eq(routines.id, id));
    return routine;
  }

  async updateRoutine(id: string, updates: Partial<InsertRoutine>): Promise<Routine> {
    const [updated] = await db
      .update(routines)
      .set(updates)
      .where(eq(routines.id, id))
      .returning();
    if (!updated) throw new Error("Routine not found");
    return updated;
  }

  async deleteRoutine(id: string): Promise<void> {
    await db.delete(routines).where(eq(routines.id, id));
  }

  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [created] = await db.insert(roadmaps).values(roadmap).returning();
    return created;
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, userId))
      .orderBy(desc(roadmaps.createdAt));
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap;
  }

  async updateRoadmap(id: string, updates: Partial<InsertRoadmap>): Promise<Roadmap> {
    const [updated] = await db
      .update(roadmaps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(roadmaps.id, id))
      .returning();
    if (!updated) throw new Error("Roadmap not found");
    return updated;
  }

  async deleteRoadmap(id: string): Promise<void> {
    await db.delete(roadmaps).where(eq(roadmaps.id, id));
  }

  async createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep> {
    const [created] = await db.insert(roadmapSteps).values(step).returning();
    return created;
  }

  async getRoadmapSteps(roadmapId: string): Promise<RoadmapStep[]> {
    return await db
      .select()
      .from(roadmapSteps)
      .where(eq(roadmapSteps.roadmapId, roadmapId))
      .orderBy(asc(roadmapSteps.orderIndex));
  }

  async getRoadmapStep(id: string): Promise<RoadmapStep | undefined> {
    const [step] = await db.select().from(roadmapSteps).where(eq(roadmapSteps.id, id));
    return step;
  }

  async updateRoadmapStep(id: string, updates: Partial<InsertRoadmapStep>): Promise<RoadmapStep> {
    const [updated] = await db
      .update(roadmapSteps)
      .set(updates)
      .where(eq(roadmapSteps.id, id))
      .returning();
    if (!updated) throw new Error("Roadmap step not found");
    return updated;
  }

  async deleteRoadmapStep(id: string): Promise<void> {
    await db.delete(roadmapSteps).where(eq(roadmapSteps.id, id));
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [created] = await db.insert(journalEntries).values(entry).returning();
    return created;
  }

  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.entryDate));
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
    return entry;
  }

  async updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry> {
    const [updated] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();
    if (!updated) throw new Error("Journal entry not found");
    return updated;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await db.delete(journalEntries).where(eq(journalEntries.id, id));
  }
}

export const storage = new PostgresStorage();
