-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('LIVE', 'RESCUED', 'STEALTH');

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "italic" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "includes" TEXT[],
    "cta" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "quote" TEXT NOT NULL,
    "who" TEXT NOT NULL,
    "co" TEXT NOT NULL,
    "initials" TEXT NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "italic" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "deliverables" TEXT[],
    "examples" TEXT[],
    "icon" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_stats" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "v" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "project_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_steps" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "n" TEXT NOT NULL,
    "t" TEXT NOT NULL,
    "italic" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "process_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_groups" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "items" TEXT[],

    CONSTRAINT "stack_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_marquee_items" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "stack_marquee_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_reasons" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "t" TEXT NOT NULL,
    "b" TEXT NOT NULL,

    CONSTRAINT "value_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "p" TEXT NOT NULL,
    "s" TEXT NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "italic" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "monogram" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "stack" TEXT[],
    "role" TEXT,
    "client" TEXT,
    "url" TEXT,
    "hero" JSONB,
    "sections" JSONB,
    "related" JSONB,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("slug")
);
