'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20211023222214 extends Migration {

  async up() {
    this.addSql('create table `discord_guilds` (`id` varchar(255) not null, `inactive_since` datetime null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `discord_guilds` add primary key `discord_guilds_pkey`(`id`);');

    this.addSql('create table `discord_roles` (`id` varchar(255) not null, `guild_id` varchar(255) not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `discord_roles` add primary key `discord_roles_pkey`(`id`);');
    this.addSql('alter table `discord_roles` add index `discord_roles_guild_id_index`(`guild_id`);');

    this.addSql('alter table `reaction_roles_on_join_settings` modify `guild_id` varchar(255);');
    this.addSql('alter table `reaction_roles_on_join_settings` drop index `reaction_roles_on_join_settings_guild_id_index`;');
    this.addSql('alter table `reaction_roles_on_join_settings` add index `reaction_roles_on_join_settings_guild_id_index`(`guild_id`);');

    this.addSql('alter table `role_hierarchy_link` modify `guild_id` varchar(255), modify `role_id` varchar(255), modify `parent_id` varchar(255);');
    this.addSql('alter table `role_hierarchy_link` drop index `role_hierarchy_link_guild_id_index`;');
    this.addSql('alter table `role_hierarchy_link` add index `role_hierarchy_link_guild_id_index`(`guild_id`);');
    this.addSql('alter table `role_hierarchy_link` add index `role_hierarchy_link_role_id_index`(`role_id`);');
    this.addSql('alter table `role_hierarchy_link` add index `role_hierarchy_link_parent_id_index`(`parent_id`);');

    this.addSql('create table `discord_emojis` (`id` varchar(255) not null, `guild_id` varchar(255) not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `discord_emojis` add primary key `discord_emojis_pkey`(`id`);');
    this.addSql('alter table `discord_emojis` add index `discord_emojis_guild_id_index`(`guild_id`);');

    this.addSql('alter table `reaction_roles_on_join` modify `guild_id` varchar(255), modify `role_id` varchar(255), modify `emoji_id` varchar(255);');
    this.addSql('alter table `reaction_roles_on_join` drop index `reaction_roles_on_join_guild_id_index`;');
    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_guild_id_index`(`guild_id`);');
    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_role_id_index`(`role_id`);');
    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_emoji_id_index`(`emoji_id`);');
    this.addSql('alter table `reaction_roles_on_join` drop `is_animated`;');

    this.addSql('create table `discord_channels` (`id` varchar(255) not null, `guild_id` varchar(255) null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `discord_channels` add primary key `discord_channels_pkey`(`id`);');
    this.addSql('alter table `discord_channels` add index `discord_channels_guild_id_index`(`guild_id`);');

    this.addSql('alter table `messenger_boost` modify `guild_id` varchar(255), modify `channel_id` varchar(255);');
    this.addSql('alter table `messenger_boost` drop index `messenger_boost_guild_id_index`;');
    this.addSql('alter table `messenger_boost` add index `messenger_boost_guild_id_index`(`guild_id`);');
    this.addSql('alter table `messenger_boost` add index `messenger_boost_channel_id_index`(`channel_id`);');

    this.addSql('alter table `messenger_join` modify `guild_id` varchar(255), modify `channel_id` varchar(255);');
    this.addSql('alter table `messenger_join` drop index `messenger_join_guild_id_index`;');
    this.addSql('alter table `messenger_join` add index `messenger_join_guild_id_index`(`guild_id`);');
    this.addSql('alter table `messenger_join` add index `messenger_join_channel_id_index`(`channel_id`);');

    this.addSql('alter table `messenger_role` modify `guild_id` varchar(255), modify `channel_id` varchar(255), modify `role_id` varchar(255);');
    this.addSql('alter table `messenger_role` drop index `messenger_role_guild_id_index`;');
    this.addSql('alter table `messenger_role` add index `messenger_role_guild_id_index`(`guild_id`);');
    this.addSql('alter table `messenger_role` add index `messenger_role_channel_id_index`(`channel_id`);');
    this.addSql('alter table `messenger_role` add index `messenger_role_role_id_index`(`role_id`);');

    this.addSql('alter table `reaction_roles` modify `guild_id` varchar(255), modify `role_id` varchar(255), modify `channel_id` varchar(255), modify `emoji_id` varchar(255);');
    this.addSql('alter table `reaction_roles` drop index `reaction_roles_guild_id_index`;');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_guild_id_index`(`guild_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_role_id_index`(`role_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_channel_id_index`(`channel_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_emoji_id_index`(`emoji_id`);');

    this.addSql('alter table `discord_roles` add constraint `discord_roles_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `discord_emojis` add constraint `discord_emojis_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `discord_channels` add constraint `discord_channels_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `reaction_roles_on_join_settings` drop index `reaction_roles_on_join_settings_guild_id_unique`;');

    this.addSql('alter table `role_hierarchy_link` drop index `role_hierarchy_link_guild_id_role_id_unique`;');

    this.addSql('alter table `role_hierarchy_link` drop index `role_hierarchy_link_guild_id_parent_id_index`;');

    this.addSql('alter table `reaction_roles_on_join` drop index `reaction_roles_on_join_guild_id_emoji_name_emoji_id_unique`;');

    this.addSql('alter table `reaction_roles_on_join` drop index `reaction_roles_on_join_guild_id_role_id_index`;');

    this.addSql('alter table `messenger_boost` drop index `messenger_boost_guild_id_channel_id_unique`;');

    this.addSql('alter table `messenger_join` drop index `messenger_join_guild_id_channel_id_unique`;');

    this.addSql('alter table `messenger_role` drop index `messenger_role_guild_id_role_id_channel_id_unique`;');

    this.addSql('alter table `messenger_role` drop index `messenger_role_guild_id_role_id_index`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_channel_id_message_id_emoji_name_emoji_id_unique`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_guild_id_role_id_index`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_channel_id_message_id_index`;');
  }

}
exports.Migration20211023222214 = Migration20211023222214;
