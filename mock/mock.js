'use strict'
const fs = require('fs')
const PATH = __dirname + '/data/'

class Mock {
    constructor(){
        
    }

    get(hostname) {
        let data = null

        try{
            data = require(PATH + hostname)
        }catch(e){
        }

        return data
    }

    put(hostname, global, global_flag){
        if(!hostname){
            return false
        }

        let data = {
            hostname,
            global: global || [],
            global_flag: global_flag || -1
        }
        let jsonString = ''
        try{
            jsonString = JSON.stringify(data, null, 4)
        }catch(e){
        }
        fs.writeFileSync(PATH + hostname + '.json', jsonString, 'utf-8')

        return true
    }
}

module.exports = new Mock()
