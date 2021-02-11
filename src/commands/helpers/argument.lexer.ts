export class ArgumentLexer {
    private static readonly QUOTE = c => /["'`]/.test(c);
    private static readonly WHITESPACE = c => /\s/.test(c);
    private static readonly BREAKPOINT = c => /["'`\s]/.test(c);

    private index = 0;
    private readonly argv: string[] = [];

    constructor(
        private cmd: string,
    ) {
    }

    next(): string | null {
        this.skipSpaces();

        if (this.done) return null;

        let char: string;
        let buffer = '';

        while ((char = this.cmd[this.index]) && !ArgumentLexer.WHITESPACE(char)) {
            if (ArgumentLexer.QUOTE(char)) {
                this.index++;
                buffer += this.readUntil(c => c == char);
            } else {
                buffer += this.readUntil(ArgumentLexer.BREAKPOINT);
            }
        }

        this.argv.push(buffer);
        return buffer;
    }

    get done(): boolean {
        return this.index >= this.cmd.length;
    }

    all(): string[] {
        while (!this.done) {
            this.next();
        }

        return Array.from(this.argv);
    }

    private readUntil(test: (char: string) => boolean) {
        let char: string;
        let buffer = '';

        while ((char = this.cmd[this.index]) && !test(char)) {
            buffer += (char == '\\')
                ? this.escape(this.cmd[++this.index])
                : char;

            this.index++;
        }

        return buffer;
    }

    private skipSpaces(): void {
        while (ArgumentLexer.WHITESPACE(this.cmd[this.index])) {
            this.index++;
        }
    }

    private escape(char: string): string {
        switch (char) {
            case 'b':
                return '\b';
            case 'f':
                return '\f';
            case 'n':
                return '\n';
            case 'r':
                return '\r';
            case 't':
                return '\t';
            case 'v':
                return '\v';
            default:
                return char;
        }
    }
}
