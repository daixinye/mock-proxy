// 这里开一个 web 服务器来处理mock请求
const http = require('http')
const express = require('express')

class Web {
    constructor(){
        this.app = express()
        this.app.use(express.static(__dirname + '/app'));
    }

    createServer(config = {
        port: '8080'
    }){
        this.app.listen(config.port, () => {
            console.log(`Web Server listening on ${config.port}`)
        })

        // this.app.get('/', (req, res) => {
        //     res.sendFile(__dirname + '/public/index.html')
        // })
        
    }

}

module.exports = Web