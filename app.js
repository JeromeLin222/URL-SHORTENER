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

app.post('/shorten', (req, res) => {
    const originalURL = req.body.inputURL
    if (!originalURL) {
        res.render('index', {error: "Please provide a URL"})
        return
    }

    const shortURL = `http://localhost:3000/${shorten(originalURL)}`
    res.render('index', {originalURL: originalURL, shortURL: shortURL})
})

app.get('/:shortURLCode', (req, res) => {
    const shortURLCode = req.params.shortURLCode
    const fullURL = urlDatabase[shortURLCode]
    if (fullURL){
        res.redirect(fullURL)
    }
    res.redirect('/?error=This URL does not exist')
    
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})

function shorten(inputURL) {
    for (const [key, val] of Object.entries(urlDatabase)) {
        if (val === inputURL) {
            return key
        }
    }
       
    const shortURLCode = generateShortURL(5)
    urlDatabase[shortURLCode] = inputURL
    fs.writeFile(DATA_FILE, JSON.stringify(urlDatabase), (err) => {
        if (err) {
            console.error('Error writing the file: ', err)
            return
        }
        console.log('File has been saved')
    })
    return shortURLCode
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
