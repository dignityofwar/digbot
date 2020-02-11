import { injectable } from 'inversify';

@injectable()
export default class CommandLexer {

    public tokenize(text: string): string[] {
        const result: string[] = [];
        let q: string | null = null;
        let buffer = '';
        let cur = '';

        for (let i = 0; i < text.length; i++) {
            cur = text.charAt(i);

            if (/\s/.test(cur)) {
                if (q) {
                    buffer += cur;
                } else {
                    result.push(buffer);
                    buffer = '';
                }
            } else if ('"\'`'.includes(cur)) {
                if (!q) {
                    q = cur;
                } else if (q === cur) {
                    q = null;
                } else {
                    buffer += cur;
                }
            } else {
                buffer += cur;
            }
        }

        result.push(buffer);

        return result;
    }
}
