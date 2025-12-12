-- CreateTable "players"
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "shirtNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_shirtNumber_key" ON "players"("shirtNumber");

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateTable "fees"
CREATE TABLE "fees" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "playerName" VARCHAR(255) NOT NULL,
    "month" VARCHAR(7) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fees_playerId_month_key" ON "fees"("playerId", "month");

-- CreateIndex
CREATE INDEX "fees_playerId_idx" ON "fees"("playerId");

-- CreateIndex
CREATE INDEX "fees_month_idx" ON "fees"("month");

-- CreateTable "matches"
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opponent" VARCHAR(255) NOT NULL,
    "result" VARCHAR(50),
    "playerIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matches_date_idx" ON "matches"("date");

-- CreateIndex
CREATE INDEX "matches_opponent_idx" ON "matches"("opponent");

-- CreateTable "scorers"
CREATE TABLE "scorers" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "playerName" VARCHAR(255) NOT NULL,
    "goalsCount" INTEGER NOT NULL DEFAULT 1,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "opponent" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scorers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scorers_matchId_playerId_key" ON "scorers"("matchId", "playerId");

-- CreateIndex
CREATE INDEX "scorers_matchId_idx" ON "scorers"("matchId");

-- CreateIndex
CREATE INDEX "scorers_playerId_idx" ON "scorers"("playerId");

-- CreateIndex
CREATE INDEX "scorers_goalsCount_idx" ON "scorers"("goalsCount");

-- AddForeignKey
ALTER TABLE "fees" ADD CONSTRAINT "fees_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorers" ADD CONSTRAINT "scorers_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorers" ADD CONSTRAINT "scorers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
