'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210901194602 extends Migration {

  async up() {
    this.addSql('create table `role_hierarchy_link` (`id` int unsigned not null auto_increment primary key, `updated_at` datetime not null, `created_at` datetime not null, `guild_id` varchar(255) not null, `role_id` varchar(255) not null, `parent_id` varchar(255) not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `role_hierarchy_link` add index `role_hierarchy_link_guild_id_index`(`guild_id`);');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_message_id_emoji_name_emoji_id_unique`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_role_id_index`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_message_id_index`;');

    this.addSql('alter table `reaction_roles` drop index `reaction_roles_expire_at_index`;');

    this.addSql('alter table `reaction_roles` add index `reaction_roles_guild_id_role_id_index`(`guild_id`, `role_id`);');

    this.addSql('alter table `reaction_roles` add index `reaction_roles_channel_id_message_id_index`(`channel_id`, `message_id`);');

    this.addSql('alter table `reaction_roles` add unique `reaction_roles_channel_id_message_id_emoji_name_emoji_id_unique`(`channel_id`, `message_id`, `emoji_name`, `emoji_id`);');

    this.addSql('alter table `reaction_roles_on_join_settings` add unique `reaction_roles_on_join_settings_guild_id_unique`(`guild_id`);');

    this.addSql('alter table `reaction_roles_on_join` drop index `reaction_roles_on_join_role_id_index`;');

    this.addSql('alter table `reaction_roles_on_join` add index `reaction_roles_on_join_guild_id_role_id_index`(`guild_id`, `role_id`);');

    this.addSql('alter table `messenger_role` drop index `messenger_role_role_id_channel_id_unique`;');

    this.addSql('alter table `messenger_role` drop index `messenger_role_role_id_index`;');

    this.addSql('alter table `messenger_role` add index `messenger_role_guild_id_role_id_index`(`guild_id`, `role_id`);');

    this.addSql('alter table `messenger_role` add unique `messenger_role_guild_id_role_id_channel_id_unique`(`guild_id`, `role_id`, `channel_id`);');

    this.addSql('alter table `role_hierarchy_link` add index `role_hierarchy_link_guild_id_parent_id_index`(`guild_id`, `parent_id`);');
    this.addSql('alter table `role_hierarchy_link` add unique `role_hierarchy_link_guild_id_role_id_unique`(`guild_id`, `role_id`);');
  }

}
exports.Migration20210901194602 = Migration20210901194602;
