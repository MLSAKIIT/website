import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" RENAME COLUMN "project_name" TO "name";
  ALTER TABLE "events" ALTER COLUMN "link" DROP NOT NULL;
  ALTER TABLE "events" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "is_button";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "is_hero";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "link" SET NOT NULL;
  ALTER TABLE "events" ADD COLUMN "project_name" varchar NOT NULL;
  ALTER TABLE "events" ADD COLUMN "is_button" boolean DEFAULT false NOT NULL;
  ALTER TABLE "events" ADD COLUMN "is_hero" boolean DEFAULT false NOT NULL;
  ALTER TABLE "events" ADD COLUMN "description" varchar NOT NULL;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "featured";`)
}
