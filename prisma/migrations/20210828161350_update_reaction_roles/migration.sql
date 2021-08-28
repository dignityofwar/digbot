/*
  Warnings:

  - You are about to alter the column `guildId` on the `MessengerBoost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `channelId` on the `MessengerBoost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `guildId` on the `MessengerJoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `channelId` on the `MessengerJoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `guildId` on the `MessengerRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `roleId` on the `MessengerRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `channelId` on the `MessengerRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `emoji` on the `ReactionRole` table. All the data in the column will be lost.
  - You are about to drop the column `joinId` on the `ReactionRole` table. All the data in the column will be lost.
  - You are about to alter the column `guildId` on the `ReactionRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `channelId` on the `ReactionRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `messageId` on the `ReactionRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `roleId` on the `ReactionRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the column `emoji` on the `ReactionRoleJoin` table. All the data in the column will be lost.
  - You are about to drop the column `messengerId` on the `ReactionRoleJoin` table. All the data in the column will be lost.
  - You are about to alter the column `roleId` on the `ReactionRoleJoin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[messageId,emojiName,emojiId]` on the table `ReactionRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildId,emojiName,emojiId]` on the table `ReactionRoleJoin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `MessengerBoost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MessengerJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MessengerRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emojiName` to the `ReactionRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ReactionRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReactionRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emojiName` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAnimated` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ReactionRoleJoin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ReactionRole` DROP FOREIGN KEY `ReactionRole_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ReactionRoleJoin` DROP FOREIGN KEY `ReactionRoleJoin_ibfk_1`;

-- DropIndex
DROP INDEX `channel_index` ON `ReactionRole`;

-- DropIndex
DROP INDEX `message_emoji_unique` ON `ReactionRole`;

-- DropIndex
DROP INDEX `messenger_emoji_unique` ON `ReactionRoleJoin`;

-- AlterTable
ALTER TABLE `MessengerBoost` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `guildId` VARCHAR(191) NOT NULL,
    MODIFY `channelId` VARCHAR(191);

-- AlterTable
ALTER TABLE `MessengerJoin` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `guildId` VARCHAR(191) NOT NULL,
    MODIFY `channelId` VARCHAR(191);

-- AlterTable
ALTER TABLE `MessengerRole` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `guildId` VARCHAR(191) NOT NULL,
    MODIFY `roleId` VARCHAR(191) NOT NULL,
    MODIFY `channelId` VARCHAR(191);

-- AlterTable
ALTER TABLE `ReactionRole` DROP COLUMN `emoji`,
    DROP COLUMN `joinId`,
    ADD COLUMN `emojiId` VARCHAR(191),
    ADD COLUMN `emojiName` VARCHAR(191) NOT NULL,
    ADD COLUMN `expireAt` DATETIME(3),
    ADD COLUMN `type` ENUM('STATIC', 'DYNAMIC') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `guildId` VARCHAR(191) NOT NULL,
    MODIFY `channelId` VARCHAR(191) NOT NULL,
    MODIFY `messageId` VARCHAR(191) NOT NULL,
    MODIFY `roleId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ReactionRoleJoin` DROP COLUMN `emoji`,
    DROP COLUMN `messengerId`,
    ADD COLUMN `emojiId` VARCHAR(191),
    ADD COLUMN `emojiName` VARCHAR(191) NOT NULL,
    ADD COLUMN `guildId` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAnimated` BOOLEAN NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `roleId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ReactionRoleJoinSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `expireDelay` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReactionRoleJoinSettings.guildId_unique`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReactionRoleJoined` (
    `joinId` INTEGER NOT NULL,
    `reactionRoleId` INTEGER NOT NULL,

    INDEX `ReactionRoleJoined.joinId_index`(`joinId`),
    UNIQUE INDEX `ReactionRoleJoined.reactionRoleId_unique`(`reactionRoleId`),
    PRIMARY KEY (`joinId`, `reactionRoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ReactionRole.expireAt_index` ON `ReactionRole`(`expireAt`);

-- CreateIndex
CREATE UNIQUE INDEX `ReactionRole.messageId_emojiName_emojiId_unique` ON `ReactionRole`(`messageId`, `emojiName`, `emojiId`);

-- CreateIndex
CREATE INDEX `ReactionRoleJoin.guildId_index` ON `ReactionRoleJoin`(`guildId`);

-- CreateIndex
CREATE INDEX `ReactionRoleJoin.roleId_index` ON `ReactionRoleJoin`(`roleId`);

-- CreateIndex
CREATE UNIQUE INDEX `ReactionRoleJoin.guildId_emojiName_emojiId_unique` ON `ReactionRoleJoin`(`guildId`, `emojiName`, `emojiId`);

-- AddForeignKey
ALTER TABLE `ReactionRoleJoined` ADD FOREIGN KEY (`joinId`) REFERENCES `ReactionRoleJoin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReactionRoleJoined` ADD FOREIGN KEY (`reactionRoleId`) REFERENCES `ReactionRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `MessengerBoost.guildId_channelId_unique` ON `MessengerBoost`(`guildId`, `channelId`);
DROP INDEX `guild_channel_unique` ON `MessengerBoost`;

-- RedefineIndex
CREATE INDEX `MessengerBoost.guildId_index` ON `MessengerBoost`(`guildId`);
DROP INDEX `guild_index` ON `MessengerBoost`;

-- RedefineIndex
CREATE UNIQUE INDEX `MessengerJoin.guildId_channelId_unique` ON `MessengerJoin`(`guildId`, `channelId`);
DROP INDEX `guild_channel_unique` ON `MessengerJoin`;

-- RedefineIndex
CREATE INDEX `MessengerJoin.guildId_index` ON `MessengerJoin`(`guildId`);
DROP INDEX `guild_index` ON `MessengerJoin`;

-- RedefineIndex
CREATE INDEX `MessengerRole.guildId_index` ON `MessengerRole`(`guildId`);
DROP INDEX `guild_index` ON `MessengerRole`;

-- RedefineIndex
CREATE UNIQUE INDEX `MessengerRole.roleId_channelId_unique` ON `MessengerRole`(`roleId`, `channelId`);
DROP INDEX `role_channel_unique` ON `MessengerRole`;

-- RedefineIndex
CREATE INDEX `MessengerRole.roleId_index` ON `MessengerRole`(`roleId`);
DROP INDEX `role_index` ON `MessengerRole`;

-- RedefineIndex
CREATE INDEX `ReactionRole.guildId_index` ON `ReactionRole`(`guildId`);
DROP INDEX `guild_index` ON `ReactionRole`;

-- RedefineIndex
CREATE INDEX `ReactionRole.messageId_index` ON `ReactionRole`(`messageId`);
DROP INDEX `message_index` ON `ReactionRole`;

-- RedefineIndex
CREATE INDEX `ReactionRole.roleId_index` ON `ReactionRole`(`roleId`);
DROP INDEX `role_index` ON `ReactionRole`;
