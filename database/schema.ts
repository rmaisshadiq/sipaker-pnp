import { integer, pgEnum, pgTable, serial, text, timestamp, uuid, json } from 'drizzle-orm/pg-core';

export const ROLE_ENUM = pgEnum("roles", ["reporter", "admin", "technician"]);
export const STATUS_ENUM = pgEnum("status", ["menunggu", "dalam_proses", "menunggu_verifikasi", "selesai"]);
export const PRIORITY_ENUM = pgEnum("priority", ["rendah", "menengah", "tinggi"]);

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: ROLE_ENUM('role').notNull().default('reporter'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow()
})

export const damage_reports = pgTable('damage_reports', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    reporterId: integer('reporter_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    location: text('location').notNull(),
    status: STATUS_ENUM('status').notNull().default('menunggu'),
    images: json('images').$type<string[]>().default([]),
    priority: PRIORITY_ENUM('priority').notNull().default('rendah'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
})

export const maintenance_reports = pgTable('maintenance_reports', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  technicianId: integer('technician_id').references(() => users.id).notNull(),
  damageReportId: uuid('damage_report_id').references(() => damage_reports.id).notNull(),
  status: STATUS_ENUM('status').notNull().default('menunggu'),
  images: json('images').$type<string[]>().default([]),
  technicianNotes: text('technician_notes').default(''),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  verifiedAt: timestamp('verified_at', {
    withTimezone: true,
  }),
})

