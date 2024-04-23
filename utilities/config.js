const path = require('path')

const config = {
    port: 8080,
    dataFile: path.join('./', 'public', 'jsons', 'data.json')
}

module.exports = config