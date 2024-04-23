const { getUrl, setUrl, urlDatabase} = require('./urlDatabase')

function generateShortURL(shortUrlLength) {
    const BASE_62_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i <= shortUrlLength; i++) {
        const randomIndex = Math.floor(Math.random() * 62)
        result += BASE_62_CHAR[randomIndex]
    }
    return result
}

function shorten(inputURL) {
    for (const [key, val] of Object.entries(urlDatabase)) {
        if (val === inputURL) {
            return key
        }
    }
    const shortURLCode = generateShortURL(5)
    setUrl(shortURLCode, inputURL)
    return shortURLCode
}

module.exports = { shorten }