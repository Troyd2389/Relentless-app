-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "currentFocus" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "weeklyAssigned" INTEGER NOT NULL DEFAULT 5,
    "topPriorities" TEXT NOT NULL,
    "nextRecommended" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'On Track',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClientProfile_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ScoreEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "relentlessScore" INTEGER NOT NULL,
    "cardio" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "mobility" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "bodyComposition" INTEGER NOT NULL,
    "lifestyle" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "ScoreEntry_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "WorkoutCheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workoutCompleted" BOOLEAN NOT NULL,
    "energy" INTEGER NOT NULL,
    "soreness" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "WorkoutCheckIn_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "HabitEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "sleepHours" REAL NOT NULL,
    "steps" INTEGER NOT NULL,
    "strengthSessions" INTEGER NOT NULL,
    "cardioSessions" INTEGER NOT NULL,
    "mobilitySessions" INTEGER NOT NULL,
    CONSTRAINT "HabitEntry_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    CONSTRAINT "TrainingPlan_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CoachNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientProfileId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoachNote_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoachNote_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");
CREATE INDEX "ScoreEntry_clientProfileId_date_idx" ON "ScoreEntry"("clientProfileId", "date");
CREATE INDEX "WorkoutCheckIn_clientProfileId_date_idx" ON "WorkoutCheckIn"("clientProfileId", "date");
CREATE INDEX "HabitEntry_clientProfileId_date_idx" ON "HabitEntry"("clientProfileId", "date");
CREATE INDEX "CoachNote_clientProfileId_createdAt_idx" ON "CoachNote"("clientProfileId", "createdAt");
