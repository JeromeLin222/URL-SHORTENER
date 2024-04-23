const express = require('express')
const { engine } = require('express-handlebars')
const app =express()
const { port } = require('./utilities/config')
const { loadUrlDatabase, getUrl } = require('./utilities/urlDatabase')
const { shorten } = require('./utilities/shortener')


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

    const shortURL = `http://localhost:${port}/${shorten(originalURL)}`
    res.render('index', {originalURL: originalURL, shortURL: shortURL})
})

app.get('/:shortURLCode', (req, res) => {
    const fullURL = getUrl(req.params.shortURLCode)
    if (fullURL){
        res.redirect(fullURL)
    } else {
        res.render('error', {shortURL: `http://localhost:${port}/${req.params.shortURLCode}`, port: `${port}`})
    }
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
    loadUrlDatabase()
})

// function shorten(inputURL) {
//     for (const [key, val] of Object.entries(urlDatabase)) {
//         if (val === inputURL) {
//             return key
//         }
//     }
       
//     const shortURLCode = generateShortURL(5)
//     urlDatabase[shortURLCode] = inputURL
//     fs.writeFile(DATA_FILE, JSON.stringify(urlDatabase), (err) => {
//         if (err) {
//             console.error('Error writing the file: ', err)
//             return
//         }
//         console.log('File has been saved')
//     })
//     return shortURLCode
// }

// function generateShortURL(shortUrlLength) {
//     const BASE_62_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
//     let result = ""
//     for (let i = 0; i < shortUrlLength; i++) {
//         const randomIndex = Math.floor(Math.random() * 62)
//         result += BASE_62_CHAR[randomIndex]
        
//     }
//     return result
// }
