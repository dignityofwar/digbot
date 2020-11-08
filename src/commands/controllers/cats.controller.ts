import { Controller } from '@nestjs/common';
import { Command } from '../decorators/command.decorator';

@Controller()
export class CatsController {
    @Command({
        command: '!cats',
        help: 'Shows a random image of cats',
    })
    cats() {

    }

    @Command({
        command: '!cats:gif',
        help: 'Shows a random gif of cats',
    })
    catsGif() {}
}
