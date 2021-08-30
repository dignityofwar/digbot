'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210830182710 extends Migration {

  async up() {
    this.addSql('create table `assigner_reaction_roles` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `role_id` varchar(255) not null, `channel_id` varchar(255) not null, `message_id` varchar(255) not null, `emoji_name` varchar(255) not null, `emoji_id` varchar(255) null, `expire_at` datetime null, `reference_type` varchar(255) not null, `reference_id` varchar(255) null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `assigner_reaction_roles` add index `assigner_reaction_roles_guild_id_index`(`guild_id`);');
    this.addSql('alter table `assigner_reaction_roles` add index `assigner_reaction_roles_role_id_index`(`role_id`);');
    this.addSql('alter table `assigner_reaction_roles` add index `assigner_reaction_roles_message_id_index`(`message_id`);');
    this.addSql('alter table `assigner_reaction_roles` add index `assigner_reaction_roles_expire_at_index`(`expire_at`);');

    this.addSql('create table `reaction_roles_on_join_settings` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `description` text not null, `expire_delay` int(11) not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');

    this.addSql('create table `reaction_roles_on_join` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `role_id` varchar(255) not null, `emoji_name` varchar(255) not null, `emoji_id` varchar(255) null, `is_animated` tinyint(1) not null, `name` varchar(255) not null, `order` int(11) not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_guild_id_index`(`guild_id`);');
    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_role_id_index`(`role_id`);');

    this.addSql('create table `messenger_role` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `role_id` varchar(255) not null, `channel_id` varchar(255) null, `message` text not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `messenger_role` add index `messenger_role_guild_id_index`(`guild_id`);');
    this.addSql('alter table `messenger_role` add index `messenger_role_role_id_index`(`role_id`);');

    this.addSql('create table `messenger_join` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `channel_id` varchar(255) null, `message` text not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `messenger_join` add index `messenger_join_guild_id_index`(`guild_id`);');

    this.addSql('create table `messenger_boost` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `channel_id` varchar(255) null, `message` text not null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `messenger_boost` add index `messenger_boost_guild_id_index`(`guild_id`);');

    this.addSql('alter table `assigner_reaction_roles` add unique `assigner_reaction_roles_message_id_emoji_name_emoji_id_unique`(`message_id`, `emoji_name`, `emoji_id`);');

    this.addSql('alter table `reaction_roles_on_join` add unique `reaction_roles_on_join_guild_id_emoji_name_emoji_id_unique`(`guild_id`, `emoji_name`, `emoji_id`);');

    this.addSql('alter table `messenger_role` add unique `messenger_role_role_id_channel_id_unique`(`role_id`, `channel_id`);');

    this.addSql('alter table `messenger_join` add unique `messenger_join_guild_id_channel_id_unique`(`guild_id`, `channel_id`);');

    this.addSql('alter table `messenger_boost` add unique `messenger_boost_guild_id_channel_id_unique`(`guild_id`, `channel_id`);');
  }

}
exports.Migration20210830182710 = Migration20210830182710;
