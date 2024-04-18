const e = require('express')
const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs')
const { url } = require('inspector')
const path = require('path')
const app =express()
const port = 3000

const DATA_FILE = path.join(__dirname, 'public', 'jsons', 'data.json')

let urlDatabase = {}
// try {
//     const urlData = fs.readFileSync(DATA_FILE)
//     urlDatabase = JSON.parse(urlData)
//     console.log(urlDatabase)
// } catch (err) {
//     console.error('Error reading the file:', err)
// }

fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if(err) {
        console.error('Error reading the file', err)
        return
    }
    try {
        const urlData = JSON.parse(data)
        urlDatabase = urlData
        console.log(urlDatabase)
    } catch (parseErr) {
        console.error('Error parsing the JSON Data:', parseErr)
    }
})


app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    const originalURL = req.body.inputURL
    if (!originalURL) {
        res.render('index', {error: "Please provide a URL"})
        return
    }

    const shortURL = shorten(originalURL)
    res.render('index', {originalURL: originalURL, shortURL: shortURL})
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

function shorten(inputURL) {
    if (urlDatabase[inputURL]) {
        return urlDatabase[inputURL]
    }

    const shortUrl = generateShortURL(5)
    urlDatabase[inputURL] = `http://localhost:3000/${shortUrl}`
    fs.writeFile(DATA_FILE, JSON.stringify(urlDatabase), (err) => {
        if (err) {
            console.error('Error writing the file: ', err)
            return
        }
        console.log('File has been saved')
    })
    return `http://localhost:3000/${shortUrl}`
}

function generateShortURL(shortUrlLength) {
    const BASE_62_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < shortUrlLength; i++) {
        const randomIndex = Math.floor(Math.random() * 62)
        result += BASE_62_CHAR[randomIndex]
        
    }
    return result
}