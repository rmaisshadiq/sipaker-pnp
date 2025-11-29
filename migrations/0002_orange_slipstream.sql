CREATE TYPE "public"."priority" AS ENUM('rendah', 'menengah', 'tinggi');--> statement-breakpoint
ALTER TABLE "damage_reports" ADD COLUMN "priority" "priority" DEFAULT 'rendah' NOT NULL;