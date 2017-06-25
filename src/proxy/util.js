class Util {
    sendJSON(res, data){
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end(JSON.stringify(data))
    }
}

module.exports = new Util()
