const e = require('express')
const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs')
const path = require('path')
const app =express()
const port = 3000

const DATA_FILE = path.join(__dirname, 'public', 'jsons', 'data.json')

let urlDatabase = {}
try {
    const data = fs.readFile(DATA_FILE)
    urlDatabase = JSON.parse(data)
} catch (error) {
    console.log('Data file not found. Starting with an empty database. ')
}


app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/shorten', (req, res) => {
    const originalURL = req.body.inputURL
    if (!originalURL) {
        res.render('index', {error: "Please provide a URL"})
        return
    }

    const shortUrl = shorten(originalURL)
    console.log(shortUrl)
    // res.render('index',{ originalURL, shortUrl})
    // fs.writeFile(DATA_FILE, JSON.stringify(urlDatabase), (err) => {
    //     if (err) {
    //         console.error('Error saving data:', err)
    //     }
    // })
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

function shorten(inputURL) {
    if (urlDatabase[inputURL]) {
        return urlDatabase[inputURL]
    }

    const shortUrl = generateShortURL(5)
    urlDatabase[inputURL] = shortUrl
    return shortUrl
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