const fs = require('fs')
const config = require('./config')
const { url } = require('inspector')

let urlDatabase = {}

function loadUrlDatabase() {
    fs.readFile(config.dataFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file', err)
            return
        }
        try {
            const urlData = JSON.parse(data)
            urlDatabase = urlData
        } catch (parseErr) {
            console.error('Error parsing the JSON data', parseErr)
        }
    })
}

function saveUrlDatabase() {
    fs.writeFile(config.dataFile, JSON.stringify(urlDatabase), (err) => {
        if (err) {
            console.error('Error writing the file:', err)
            return
        }
        console.log('File has been saved')
    })
}

function getUrl(shortURLCode) {
    return urlDatabase[shortURLCode]
}

function setUrl(shortURLCode, inputURL) {
    urlDatabase[shortURLCode] = inputURL
    saveUrlDatabase()
}

module.exports = {loadUrlDatabase, getUrl, setUrl, urlDatabase}