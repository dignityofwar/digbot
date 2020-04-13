export function getBool(value?: string, def = false): boolean {
    if (value)
        switch (value.trim().toUpperCase()) {
            case 'TRUE':
                return true;
            case 'FALSE':
                return false;
        }

    return def;
}
