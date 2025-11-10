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
import { db } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";

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
  updateRoadmapStep(id: string, updates: Partial<InsertRoadmapStep>): Promise<RoadmapStep>;
  deleteRoadmapStep(id: string): Promise<void>;

  // Journal operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
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
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Goal operations
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [created] = await db.insert(goals).values(goal).returning();
    return created;
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
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
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Habit operations
  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values(habit).returning();
    return created;
  }

  async getHabitsByUserId(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId)).orderBy(desc(habits.createdAt));
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit;
  }

  async updateHabit(id: string, updates: Partial<InsertHabit>): Promise<Habit> {
    const [updated] = await db
      .update(habits)
      .set(updates)
      .where(eq(habits.id, id))
      .returning();
    return updated;
  }

  async deleteHabit(id: string): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  // Habit check-in operations
  async createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn> {
    const [created] = await db.insert(habitCheckIns).values(checkIn).returning();
    return created;
  }

  async getHabitCheckIns(habitId: string, startDate?: string, endDate?: string): Promise<HabitCheckIn[]> {
    const conditions = [eq(habitCheckIns.habitId, habitId)];
    
    if (startDate && endDate) {
      conditions.push(gte(habitCheckIns.completedAt, startDate));
      conditions.push(lte(habitCheckIns.completedAt, endDate));
    }
    
    return await db
      .select()
      .from(habitCheckIns)
      .where(and(...conditions))
      .orderBy(desc(habitCheckIns.completedAt));
  }

  // Routine operations
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
    return updated;
  }

  async deleteRoutine(id: string): Promise<void> {
    await db.delete(routines).where(eq(routines.id, id));
  }

  // Roadmap operations
  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [created] = await db.insert(roadmaps).values(roadmap).returning();
    return created;
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return await db.select().from(roadmaps).where(eq(roadmaps.userId, userId)).orderBy(desc(roadmaps.createdAt));
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
    return updated;
  }

  async deleteRoadmap(id: string): Promise<void> {
    await db.delete(roadmaps).where(eq(roadmaps.id, id));
  }

  // Roadmap step operations
  async createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep> {
    const [created] = await db.insert(roadmapSteps).values(step).returning();
    return created;
  }

  async getRoadmapSteps(roadmapId: string): Promise<RoadmapStep[]> {
    return await db
      .select()
      .from(roadmapSteps)
      .where(eq(roadmapSteps.roadmapId, roadmapId))
      .orderBy(roadmapSteps.orderIndex);
  }

  async updateRoadmapStep(id: string, updates: Partial<InsertRoadmapStep>): Promise<RoadmapStep> {
    const [updated] = await db
      .update(roadmapSteps)
      .set(updates)
      .where(eq(roadmapSteps.id, id))
      .returning();
    return updated;
  }

  async deleteRoadmapStep(id: string): Promise<void> {
    await db.delete(roadmapSteps).where(eq(roadmapSteps.id, id));
  }

  // Journal operations
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
    return updated;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await db.delete(journalEntries).where(eq(journalEntries.id, id));
  }
}

export const storage = new DatabaseStorage();
