-- CreateTable
CREATE TABLE "BotStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "botDifficulty" TEXT NOT NULL,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "winCount" INTEGER NOT NULL DEFAULT 0,
    "lossCount" INTEGER NOT NULL DEFAULT 0,
    "winPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "perfectPuzzles" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "fastestWinTime" INTEGER,
    "averageMatchTime" DOUBLE PRECISION,
    "groupsSolvedFirst" INTEGER NOT NULL DEFAULT 0,
    "botOutsolvedFirst" INTEGER NOT NULL DEFAULT 0,
    "threeMistakeFails" INTEGER NOT NULL DEFAULT 0,
    "totalWordsGuessed" INTEGER NOT NULL DEFAULT 0,
    "totalMistakes" INTEGER NOT NULL DEFAULT 0,
    "accuracyPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mostGuessedWord" TEXT,
    "mostCommonTheme" TEXT,
    "dramaticComebacks" INTEGER NOT NULL DEFAULT 0,
    "clutchWins" INTEGER NOT NULL DEFAULT 0,
    "cleanSweeps" INTEGER NOT NULL DEFAULT 0,
    "multiPerfects" INTEGER NOT NULL DEFAULT 0,
    "averageMistakesPerMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotStats_userId_botDifficulty_key" ON "BotStats"("userId", "botDifficulty");

-- AddForeignKey
ALTER TABLE "BotStats" ADD CONSTRAINT "BotStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
