'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210831135445 extends Migration {

  async up() {
    this.addSql('create table `reaction_roles` (`id` int unsigned not null auto_increment primary key, `guild_id` varchar(255) not null, `role_id` varchar(255) not null, `channel_id` varchar(255) not null, `message_id` varchar(255) not null, `emoji_name` varchar(255) not null, `emoji_id` varchar(255) null, `expire_at` datetime null, `reference_type` varchar(255) not null, `reference_id` varchar(255) null, `updated_at` datetime not null, `created_at` datetime not null) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_guild_id_index`(`guild_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_role_id_index`(`role_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_message_id_index`(`message_id`);');
    this.addSql('alter table `reaction_roles` add index `reaction_roles_expire_at_index`(`expire_at`);');

    this.addSql('alter table `reaction_roles` add unique `reaction_roles_message_id_emoji_name_emoji_id_unique`(`message_id`, `emoji_name`, `emoji_id`);');

    this.addSql('drop table if exists `assigner_reaction_roles`;');
  }

}
exports.Migration20210831135445 = Migration20210831135445;
