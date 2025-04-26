const k = 5

/**
 * @param {string} text - The string to encrypt.
 * @returns {string} - The encrypted string.
 */
export function encrypt(text) {
    let result = ''
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        const encryptedChar = String.fromCharCode(char + k)
        result += encryptedChar
    }
    return result
}

/**
 * @param {string} text - The string to decrypt.
 * @returns {string} - The decrypted string.
 */
export function decrypt(text) {
    let result = ''
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        const decryptedChar = String.fromCharCode(char - k)
        result += decryptedChar
    }
    return result
}


