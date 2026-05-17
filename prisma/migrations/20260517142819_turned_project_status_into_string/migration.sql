/*
  Warnings:

  - Changed the type of `status` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "relatedSlugs" DROP DEFAULT;

-- DropEnum
DROP TYPE "ProjectStatus";
