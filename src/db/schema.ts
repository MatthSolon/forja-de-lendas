import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  masterName: text("master_name").notNull(),
  state: jsonb("state").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  player: text("player").notNull(),
  race: text("race").notNull(),
  classKey: text("class_key").notNull(),
  subclassKey: text("subclass_key").notNull().default(""),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  stats: jsonb("stats").notNull(),
  hp: integer("hp").notNull(),
  maxHp: integer("max_hp").notNull(),
  ac: integer("ac").notNull(),
  gold: integer("gold").notNull().default(0),
  color: text("color").notNull().default("#c9a227"),
  portrait: integer("portrait").notNull().default(0),
  equipment: jsonb("equipment").notNull().default({}),
  spells: jsonb("spells").notNull().default([]),
  inventory: jsonb("inventory").notNull().default([]),
  bio: text("bio").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
