const DEFAULT_STATE = 5;
const DEFAULT_ADD = 9;
const DEFAULT_MODULO = 254;

const decodeRawToken = token => {
    const result = [];
    let state = DEFAULT_STATE;

    for (const character of atob(token)) {
        const byte = character.charCodeAt(0);
        result.push(byte ^ state);
        state = (state + DEFAULT_ADD) % DEFAULT_MODULO;
    }

    return new Uint8Array(result);
};

const getClientSourcePath = async () => {
    const response = await fetch('https://sploop.io');
    const text = await response.text();
    return text.match(/js\/[a-z\d]{20}\.js/g)?.[0];
};

const getClientSourceLength = async path => {
    const response = await fetch('https://sploop.io/' + path);
    const text = await response.text();
    return text.length;
};

const getRawToken = async length => {
    const version = Math.random() * 100_000;
    const response = await fetch(`https://token.sploop.io/${length}?v=${version}`);
    return await response.text();
};

export const getToken = async () => {
    const path = await getClientSourcePath();
    const length = await getClientSourceLength(path);
    const token = await getRawToken(length);
    return decodeRawToken(token);
};
