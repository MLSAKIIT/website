import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "yearbook" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "yearbook_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"yearbook_profiles_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "yearbook_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer,
  	"name" varchar NOT NULL,
  	"yearbook_profile_pic_id" integer NOT NULL,
  	"role" varchar NOT NULL,
  	"testimonial" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "members" ADD COLUMN "is_active" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yearbook_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yearbook_profiles_id" integer;
  DO $$ BEGIN
   ALTER TABLE "yearbook_rels" ADD CONSTRAINT "yearbook_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."yearbook"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "yearbook_rels" ADD CONSTRAINT "yearbook_rels_yearbook_profiles_fk" FOREIGN KEY ("yearbook_profiles_id") REFERENCES "public"."yearbook_profiles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "yearbook_profiles" ADD CONSTRAINT "yearbook_profiles_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "yearbook_profiles" ADD CONSTRAINT "yearbook_profiles_yearbook_profile_pic_id_media_id_fk" FOREIGN KEY ("yearbook_profile_pic_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "yearbook_updated_at_idx" ON "yearbook" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "yearbook_created_at_idx" ON "yearbook" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "yearbook_rels_order_idx" ON "yearbook_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "yearbook_rels_parent_idx" ON "yearbook_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "yearbook_rels_path_idx" ON "yearbook_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "yearbook_rels_yearbook_profiles_id_idx" ON "yearbook_rels" USING btree ("yearbook_profiles_id");
  CREATE INDEX IF NOT EXISTS "yearbook_profiles_member_idx" ON "yearbook_profiles" USING btree ("member_id");
  CREATE INDEX IF NOT EXISTS "yearbook_profiles_yearbook_profile_pic_idx" ON "yearbook_profiles" USING btree ("yearbook_profile_pic_id");
  CREATE INDEX IF NOT EXISTS "yearbook_profiles_updated_at_idx" ON "yearbook_profiles" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "yearbook_profiles_created_at_idx" ON "yearbook_profiles" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yearbook_fk" FOREIGN KEY ("yearbook_id") REFERENCES "public"."yearbook"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yearbook_profiles_fk" FOREIGN KEY ("yearbook_profiles_id") REFERENCES "public"."yearbook_profiles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_yearbook_id_idx" ON "payload_locked_documents_rels" USING btree ("yearbook_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_yearbook_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("yearbook_profiles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yearbook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yearbook_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yearbook_profiles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "yearbook" CASCADE;
  DROP TABLE "yearbook_rels" CASCADE;
  DROP TABLE "yearbook_profiles" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yearbook_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yearbook_profiles_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_yearbook_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_yearbook_profiles_id_idx";
  ALTER TABLE "members" DROP COLUMN IF EXISTS "is_active";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "yearbook_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "yearbook_profiles_id";`)
}
