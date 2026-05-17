-- Replace the JSON `related` column with a typed `relatedSlugs` String[] column.
-- Existing related JSON data is dropped; slugs must be re-entered via the admin.

ALTER TABLE "projects" DROP COLUMN "related";
ALTER TABLE "projects" ADD COLUMN "relatedSlugs" TEXT[] NOT NULL DEFAULT '{}';
