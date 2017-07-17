'use strict'

class Hosts {
    constructor(){
        this.config = require('./hostsConfig.json')
    }

    get(hostname) {
        let data = null
        try{
            data = this.config[hostname]
        }catch(e){
            console.log(e)
        }

        return data
    }

    //put()

    //del()
}

module.exports = new Hosts()
