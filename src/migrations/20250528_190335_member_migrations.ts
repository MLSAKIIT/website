import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // number
  await db.execute(sql`
    ALTER TABLE "members_phone_numbers" ALTER COLUMN "number" SET DATA TYPE numeric USING "number"::numeric;
    `)

  // role
  await db.execute(sql`
    CREATE TYPE "public"."enum_members_role_new" AS ENUM('lead', 'vice-lead', 'executive', 'tech-lead', 'web-dev-lead', 'ai-ml-lead', 'app-dev-lead', 'cloud-lead', 'cybersecurity-lead', 'ui-ux-lead', 'xr-game-dev-lead', 'broadcasting-lead', 'content-lead', 'cr-lead', 'creative-lead', 'graphic-design-lead', 'pr-lead', 'member');

    ALTER TABLE "public"."members"
    ALTER COLUMN "role" SET DATA TYPE "public"."enum_members_role_new"
    USING 'member'::"public"."enum_members_role_new";

    DROP TYPE "public"."enum_members_role";
    ALTER TYPE "public"."enum_members_role_new" RENAME TO "enum_members_role";
    ALTER TABLE "public"."members" ALTER COLUMN "role" SET DEFAULT 'member'::"public"."enum_members_role";
  `)

  // domain
  await db.execute(sql`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_members_domain') THEN
            CREATE TYPE "public"."enum_members_domain" AS ENUM('web-dev', 'ai-ml', 'app-dev', 'cloud', 'cybersecurity', 'ui-ux', 'xr-game-dev', 'broadcasting', 'content', 'cr', 'creative', 'graphic-design', 'pr');
        END IF;
    END$$;
  
    ALTER TABLE "public"."members"
    ALTER COLUMN "domain" SET DATA TYPE "public"."enum_members_domain"
    USING 
        CASE 
            WHEN "domain"::text = ANY(ARRAY['web-dev', 'ai-ml', 'app-dev', 'cloud', 'cybersecurity', 'ui-ux', 'xr-game-dev', 'broadcasting', 'content', 'cr', 'creative', 'graphic-design', 'pr']) THEN "domain"::text::"public"."enum_members_domain"
            ELSE NULL
        END;
    `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "members" ALTER COLUMN "domain" SET DATA TYPE varchar USING "domain"::text;
    DROP TYPE IF EXISTS "public"."enum_members_domain";

    CREATE TYPE "public"."enum_members_role_old_temp" AS ENUM('lead', 'vice lead', 'executive', 'leads', 'ex-leads');
    ALTER TABLE "public"."members"
    ALTER COLUMN "role" DROP DEFAULT,
    ALTER COLUMN "role" SET DATA TYPE "public"."enum_members_role_old_temp"
    USING 'member'::"public"."enum_members_role_old_temp";

    DROP TYPE "public"."enum_members_role";
    ALTER TYPE "public"."enum_members_role_old_temp" RENAME TO "enum_members_role";

    ALTER TABLE "members_phone_numbers" ALTER COLUMN "number" SET DATA TYPE varchar;
    `)
}
