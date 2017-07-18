'use strict'

class Hosts {
    constructor(){
        this.config = require('./../config/hosts.json')
    }

    get(hostname) {
        let host = null
        host = this.config[hostname]
        if(host){
            // 存在host配置
            let {
                valid,
                config
            } = host

            return valid == -1 ? false : {
                host: config[valid].host,
                port: config[valid].port || 80
            }
        }

        return false
    }

    //put()

    //del()
}

module.exports = new Hosts()
