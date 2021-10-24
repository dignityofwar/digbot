'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20211024192925 extends Migration {

  async up() {
    this.addSql('alter table `reaction_roles_on_join_settings` add constraint `reaction_roles_on_join_settings_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `role_hierarchy_link` add constraint `role_hierarchy_link_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `role_hierarchy_link` add constraint `role_hierarchy_link_role_id_foreign` foreign key (`role_id`) references `discord_roles` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `role_hierarchy_link` add constraint `role_hierarchy_link_parent_id_foreign` foreign key (`parent_id`) references `discord_roles` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `reaction_roles_on_join` add constraint `reaction_roles_on_join_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reaction_roles_on_join` add constraint `reaction_roles_on_join_role_id_foreign` foreign key (`role_id`) references `discord_roles` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reaction_roles_on_join` add constraint `reaction_roles_on_join_emoji_id_foreign` foreign key (`emoji_id`) references `discord_emojis` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `messenger_boost` add constraint `messenger_boost_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `messenger_boost` add constraint `messenger_boost_channel_id_foreign` foreign key (`channel_id`) references `discord_channels` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `messenger_join` add constraint `messenger_join_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `messenger_join` add constraint `messenger_join_channel_id_foreign` foreign key (`channel_id`) references `discord_channels` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `messenger_role` add constraint `messenger_role_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `messenger_role` add constraint `messenger_role_channel_id_foreign` foreign key (`channel_id`) references `discord_channels` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `messenger_role` add constraint `messenger_role_role_id_foreign` foreign key (`role_id`) references `discord_roles` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `reaction_roles` add constraint `reaction_roles_guild_id_foreign` foreign key (`guild_id`) references `discord_guilds` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reaction_roles` add constraint `reaction_roles_role_id_foreign` foreign key (`role_id`) references `discord_roles` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reaction_roles` add constraint `reaction_roles_channel_id_foreign` foreign key (`channel_id`) references `discord_channels` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `reaction_roles` add constraint `reaction_roles_emoji_id_foreign` foreign key (`emoji_id`) references `discord_emojis` (`id`) on update cascade on delete cascade;');
  }

}
exports.Migration20211024192925 = Migration20211024192925;
