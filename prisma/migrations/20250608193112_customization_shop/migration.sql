-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "equippedBurnTrailId" TEXT,
ADD COLUMN     "equippedEmojiPackId" TEXT,
ADD COLUMN     "equippedFontId" TEXT,
ADD COLUMN     "equippedFrameId" TEXT,
ADD COLUMN     "equippedSoundPackId" TEXT,
ADD COLUMN     "equippedThemeId" TEXT,
ADD COLUMN     "equippedTitleId" TEXT,
ADD COLUMN     "premiumCurrency" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CustomizationItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" TEXT,
    "price" INTEGER,
    "premiumPrice" INTEGER,
    "previewUrl" TEXT,
    "isSeasonal" BOOLEAN NOT NULL DEFAULT false,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "availableAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomizationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "via" TEXT,

    CONSTRAINT "UserCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLoadout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "themeId" TEXT,
    "fontId" TEXT,
    "emojiPackId" TEXT,
    "soundPackId" TEXT,
    "titleId" TEXT,
    "frameId" TEXT,
    "burnTrailId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLoadout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCustomization" ADD CONSTRAINT "UserCustomization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomization" ADD CONSTRAINT "UserCustomization_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CustomizationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLoadout" ADD CONSTRAINT "UserLoadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
