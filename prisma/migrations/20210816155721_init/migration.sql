-- CreateTable
CREATE TABLE `messenger_join` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255),
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `guild_index`(`guildId`),
    UNIQUE INDEX `guild_channel_unique`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messenger_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255),
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `role_index`(`roleId`),
    INDEX `guild_index`(`guildId`),
    UNIQUE INDEX `role_channel_unique`(`roleId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messenger_boost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255),
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `guild_index`(`guildId`),
    UNIQUE INDEX `guild_channel_unique`(`guildId`, `channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rr_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `messageId` VARCHAR(255) NOT NULL,
    `emoji` VARCHAR(255) NOT NULL,
    `roleId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `role_index`(`roleId`),
    INDEX `guild_index`(`guildId`),
    INDEX `channel_index`(`channelId`),
    INDEX `message_index`(`messageId`),
    UNIQUE INDEX `message_emoji_unique`(`messageId`, `emoji`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
