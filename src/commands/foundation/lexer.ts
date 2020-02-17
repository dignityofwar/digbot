/**
 * Lexer to split a string into arguments(like a terminal)
 */
export default class CommandLexer {
    /**
     * Break points
     */
    private static readonly QUOTES: string[] = ['"', '\'', '`'];
    private static readonly WHITESPACES: string[] = [' ', '\n', '\t', '\f', '\v'];
    private static readonly BREAKS: string[] = CommandLexer.QUOTES.concat(CommandLexer.WHITESPACES);

    /**
     * The string to be tokenized
     */
    private readonly text: string;

    /**
     * The current position
     */
    private pos!: number;

    /**
     * Constructor for CommandLexer
     *
     * @param {string} text Text to be tokenized
     */
    public constructor(text: string) {
        this.text = text;

        this.reset();
    }

    /**
     * Resets the lexer to start from the beginning
     */
    public reset(): void {
        this.pos = 0;
    }

    /**
     * Returns the next token
     *
     * @return {string} The token, returns an empty string when done
     */
    public next(): string {
        this.skipSpaces();

        let cur = this.text[this.pos];
        let buffer = '';

        while (this.pos < this.text.length && /\S/.test(cur)) {
            if (CommandLexer.QUOTES.includes(cur)) {
                this.pos++;

                buffer += this.readUntil([cur]);

                this.pos++;
            } else {
                buffer += this.readUntil(CommandLexer.BREAKS);
            }

            cur = this.text[this.pos];
        }

        return buffer;
    }

    /**
     * Returns all remaining tokens
     *
     * @return {string[]} The remaining tokens
     */
    public remaining(): string[] {
        const argv: string[] = [];

        this.skipSpaces();

        while (!this.done()) {
            argv.push(this.next());
            this.skipSpaces();
        }

        return argv;
    }

    /**
     * Reads until it reaches a breakpoint and returns the result
     * @param {string[]} until The breakpoint
     * @return {string} The result
     */
    private readUntil(until: string[]): string {
        let buffer = '';

        while (this.pos < this.text.length && !until.includes(this.text[this.pos])) {
            if (this.text[this.pos] == '\\') {
                this.pos++;

                switch (this.text[this.pos]) {
                    case 'b':
                        buffer += '\b';
                        break;
                    case 'f':
                        buffer += '\f';
                        break;
                    case 'n':
                        buffer += '\n';
                        break;
                    case 'r':
                        buffer += '\r';
                        break;
                    case 't':
                        buffer += '\t';
                        break;
                    case 'v':
                        buffer += '\v';
                        break;
                    default:
                        buffer += this.text[this.pos];
                }
            } else {
                buffer += this.text[this.pos];
            }

            this.pos++;
        }

        return buffer;
    }

    /**
     * Skips all spaces
     */
    private skipSpaces(): void {
        while (CommandLexer.WHITESPACES.includes(this.text[this.pos]))
            this.pos++;
    }

    /**
     * Checks if the complete text has been scanned
     *
     * @return {boolean} True if the position is at the end
     */
    public done(): boolean {
        return this.pos >= this.text.length;
    }
}
