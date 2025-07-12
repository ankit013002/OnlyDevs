CREATE TABLE "application_status_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"application_id" integer NOT NULL,
	"status" "application_status_enum" NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"contact_method" jsonb
);
--> statement-breakpoint
ALTER TABLE "application_status_table" ADD CONSTRAINT "application_status_table_post_id_postings_table_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."postings_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_status_table" ADD CONSTRAINT "application_status_table_application_id_applications_table_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications_table"("id") ON DELETE cascade ON UPDATE no action;