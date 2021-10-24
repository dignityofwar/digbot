'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20211024192801 extends Migration {

  async up() {
    this.addSql('alter table `reaction_roles_on_join_settings` modify `guild_id` varchar(255) not null;');

    this.addSql('alter table `role_hierarchy_link` modify `guild_id` varchar(255) not null, modify `role_id` varchar(255) not null, modify `parent_id` varchar(255) not null;');

    this.addSql('alter table `reaction_roles_on_join` modify `guild_id` varchar(255) not null, modify `role_id` varchar(255) not null, modify `emoji_id` varchar(255);');

    this.addSql('alter table `messenger_boost` modify `guild_id` varchar(255) not null, modify `channel_id` varchar(255);');

    this.addSql('alter table `messenger_join` modify `guild_id` varchar(255) not null, modify `channel_id` varchar(255);');

    this.addSql('alter table `messenger_role` modify `guild_id` varchar(255) not null, modify `channel_id` varchar(255), modify `role_id` varchar(255) not null;');

    this.addSql('alter table `reaction_roles` modify `guild_id` varchar(255) not null, modify `role_id` varchar(255) not null, modify `channel_id` varchar(255) not null, modify `emoji_id` varchar(255);');
  }

}
exports.Migration20211024192801 = Migration20211024192801;
