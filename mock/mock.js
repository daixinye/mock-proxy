'use strict'
const fs = require('fs')
const PATH = __dirname + '/data/'

function _format(hostname){
    return PATH + hostname + '.json'
}

class Mock {
    constructor(){
        
    }

    get(hostname) {
        let data = null

        try{
            data = require(_format(hostname))
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
        fs.writeFileSync(_format(hostname), jsonString, 'utf-8')

        return true
    }

    del(hostname) {
        try{
            fs.unlinkSync(_format(hostname))
        }catch(e){
            console.log(e)
        }
    }
}

let Test = new class{
    constructor() {
        this.mock = new Mock()
        console.log('test')
        this.main()
    }

    main(){
        // this.mock.put('testhost')
        this.mock.del('testhost')
    }
}()


module.exports = new Mock()
