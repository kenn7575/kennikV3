-- CreateTable
CREATE TABLE "availability_slots" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);
