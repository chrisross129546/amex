const DEFAULT_HASH_SEED = 0;

const cyrb53 = (string, seed = DEFAULT_HASH_SEED) => {
    let a = 0xdeadbeef ^ seed,
        b = 0x41c6ce57 ^ seed;

    for (const character of string) {
        const code = character.charCodeAt(0);
        a = Math.imul(a ^ code, 2654435761);
        b = Math.imul(b ^ code, 1597334677);
    }

    a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
    b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);

    return (b & 2097151) * 4294967296 + (a >>> 0);
};

const DEFAULT_STRING_LENGTH = 16;
const STRING_CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const STRING_CHARACTER_SET_SIZE = STRING_CHARACTER_SET.length;

export const getRandomIdentifier = (length = DEFAULT_STRING_LENGTH) => Array.from(Array(length), () => STRING_CHARACTER_SET[(Math.random() * STRING_CHARACTER_SET_SIZE) | 0]).join('');

export const solve = (clientIdentifier, sessionIdentifier, string) => {
    const key = btoa(
        JSON.stringify({
            value: clientIdentifier,
            sig: cyrb53(clientIdentifier),
            value2: sessionIdentifier,
            sig2: cyrb53(sessionIdentifier),
        })
    );

    const hash = Array.from(string).reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) & hash, 0);

    return `${key}:${hash}`;
};
