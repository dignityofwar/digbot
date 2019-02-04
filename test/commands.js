const { expect } = require('chai');
const fs = require('fs');
const { join } = require('path');

const BaseCommand = require('../src/lib/core/command');

const AsyncFunction = (async () => {}).constructor;
const COMMANDS_DIR = join(process.cwd(), 'src/lib/commands');

describe('Commands', () => {
    for (const cf of fs.readdirSync(COMMANDS_DIR)) {
        const Command = require(join(COMMANDS_DIR, cf)); // eslint-disable-line

        describe(`${Command.name}`, () => {
            it('should be an instance of Command', () => {
                expect(Command.prototype).to.be.an.instanceof(BaseCommand);
            });

            it('should have async execute method', () => {
                expect(Command.prototype.execute).to.be.an.instanceof(AsyncFunction);
            });

            it('should have help function', () => {
                expect(Command.prototype.help).to.be.an.instanceof(Function);
            });

            it('help should return a string', () => {
                expect(Command.prototype.help()).to.be.a('string');
            });
        });
    }
});
