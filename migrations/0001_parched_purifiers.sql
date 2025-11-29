ALTER TYPE "public"."status" ADD VALUE 'menunggu_verifikasi' BEFORE 'selesai';--> statement-breakpoint
ALTER TABLE "damage_reports" RENAME COLUMN "user_id" TO "reporter_id";--> statement-breakpoint
ALTER TABLE "maintenance_reports" RENAME COLUMN "user_id" TO "technician_id";--> statement-breakpoint
ALTER TABLE "damage_reports" DROP CONSTRAINT "damage_reports_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "maintenance_reports" DROP CONSTRAINT "maintenance_reports_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "damage_reports" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD COLUMN "damage_report_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD COLUMN "images" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD COLUMN "technician_notes" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_damage_report_id_damage_reports_id_fk" FOREIGN KEY ("damage_report_id") REFERENCES "public"."damage_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "damage_reports" DROP COLUMN "verified_at";--> statement-breakpoint
ALTER TABLE "maintenance_reports" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "maintenance_reports" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "maintenance_reports" DROP COLUMN "updated_at";