-- Add a temporary column that allows NULL
ALTER TABLE "User" ADD COLUMN "clerkId" TEXT;

-- Make it NOT NULL after adding default values
ALTER TABLE "User" ALTER COLUMN "clerkId" SET NOT NULL;

-- Add the unique constraint
ALTER TABLE "User" ADD CONSTRAINT "User_clerkId_key" UNIQUE ("clerkId"); 