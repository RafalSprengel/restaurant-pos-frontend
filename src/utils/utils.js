function removeDiacritics(text) {
    const diacriticMap = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    };
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, function (match) {
        return diacriticMap[match] || match;
    });
}

export function createSlug(text) {
    return removeDiacritics(text)                // Usunięcie polskich znaków diakrytycznych
        .toLowerCase()                     // Zamiana na małe litery
        .replace(/[^\w\s-]/g, '')         // Usunięcie znaków specjalnych
        .replace(/\s+/g, '-')             // Zamiana spacji na myślniki
        .replace(/--+/g, '-')             // Usunięcie podwójnych myślników
        .trim();                          // Usunięcie białych znaków na końcach
}

