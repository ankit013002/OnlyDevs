import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const postingStatusEnum = pgEnum("posting_status_enum", [
  "open",
  "in_progress",
  "closed",
]);

export const applicationStatusEnum = pgEnum("application_status_enum", [
  "pending",
  "accepted",
  "declined",
]);

export type ApplicationStatus =
  (typeof applicationStatusEnum.enumValues)[number];

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  contact: jsonb("contact")
    .$type<{ type: string; link: string }[]>()
    .notNull()
    .default(sql`'[]'`),
  techTags: jsonb("tech_tags")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
});

export const postingsTable = pgTable("postings_table", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techTags: jsonb("tech_tags")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  rolesNeeded: integer("roles_needed").notNull().default(1),
  roster: jsonb("roster")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  status: postingStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const applicationsTable = pgTable("applications_table", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => postingsTable.id, { onDelete: "cascade" }),
  applicantId: integer("applicant_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  introText: text("intro_text"),
  portfolioUrl: text("portfolio_url"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
});

export const applicationStatusTable = pgTable("application_status_table", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => postingsTable.id, { onDelete: "cascade" }),
  applicationId: integer("application_id")
    .notNull()
    .references(() => applicationsTable.id, { onDelete: "cascade" }),
  status: applicationStatusEnum("status").notNull(),
  changedAt: timestamp("changed_at").notNull().defaultNow(),
  contactMethod: jsonb("contact_method").$type<{
    type: string;
    link: string;
  }>(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPosting = typeof postingsTable.$inferInsert;
export type SelectPosting = typeof postingsTable.$inferSelect;

export type InsertApplication = typeof applicationsTable.$inferInsert;
export type SelectApplication = typeof applicationsTable.$inferSelect;

export type InsertApplicationStatus =
  typeof applicationStatusTable.$inferInsert;
export type SelectApplicationStatus =
  typeof applicationStatusTable.$inferSelect;
