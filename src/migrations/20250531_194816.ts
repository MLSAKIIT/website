import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_members_role" ADD VALUE 'creative-lead' BEFORE 'member';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public"."members" ALTER COLUMN "role" SET DATA TYPE text;
  DROP TYPE "public"."enum_members_role";
  CREATE TYPE "public"."enum_members_role" AS ENUM('lead', 'vice-lead', 'executive', 'tech-lead', 'domain-lead', 'member');
  ALTER TABLE "public"."members" ALTER COLUMN "role" SET DATA TYPE "public"."enum_members_role" USING "role"::"public"."enum_members_role";`)
}
