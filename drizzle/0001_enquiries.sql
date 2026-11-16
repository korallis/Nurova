CREATE TYPE "public"."form_kind" AS ENUM('enquiry');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('open', 'resolved', 'archived');--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form" "form_kind" NOT NULL,
	"reference" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"subject" text NOT NULL,
	"answers" jsonb NOT NULL,
	"status" "submission_status" DEFAULT 'open' NOT NULL,
	"read_at" timestamp with time zone,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "form_submissions_reference_unique" UNIQUE("reference")
);
