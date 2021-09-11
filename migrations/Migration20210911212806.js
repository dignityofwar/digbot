'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210911212806 extends Migration {

  async up() {
    this.addSql('alter table `reaction_roles_on_join_settings` add `delay` int(11) null;');
  }

}
exports.Migration20210911212806 = Migration20210911212806;
