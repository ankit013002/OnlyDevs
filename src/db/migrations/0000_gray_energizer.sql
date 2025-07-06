CREATE TYPE "public"."application_status_enum" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."posting_status_enum" AS ENUM('open', 'in_progress', 'closed');--> statement-breakpoint
CREATE TABLE "applications_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"applicant_id" integer NOT NULL,
	"intro_text" text,
	"portfolio_url" text,
	"status" "application_status_enum" DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "postings_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tech_tags" jsonb DEFAULT '[]' NOT NULL,
	"roles_needed" integer DEFAULT 1 NOT NULL,
	"status" "posting_status_enum" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"bio" text,
	"tech_tags" jsonb DEFAULT '[]' NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications_table" ADD CONSTRAINT "applications_table_post_id_postings_table_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."postings_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications_table" ADD CONSTRAINT "applications_table_applicant_id_users_table_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postings_table" ADD CONSTRAINT "postings_table_owner_id_users_table_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;