import { integer, pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const ROLE_ENUM = pgEnum("roles", ["reporter", "admin", "technician"]);
export const STATUS_ENUM = pgEnum("status", ["menunggu", "dalam_proses", "selesai"]);

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: ROLE_ENUM('role').notNull().default('reporter'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow()
});

export const damage_reports = pgTable('damage_reports', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: STATUS_ENUM('status').notNull().default('menunggu'),
    verifiedAt: timestamp('verified_at', {
      withTimezone: true,
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
})

export const maintenance_reports = pgTable('maintenance_reports', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: STATUS_ENUM('status').notNull().default('menunggu'),
  verifiedAt: timestamp('verified_at', {
    withTimezone: true,
  }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
})

