'use strict'

class Hosts {
    constructor(path = './../config/hosts.json'){
        Object.defineProperties(this, {
            config_file: {
                value: require(path),
                enumerable: false,
                configurable: false,
                writable: false
            }
        })
    }

    // 根据 hostname 获取配置信息
    get(hostname) {
        let host_config = this.config_file[hostname]
        // 不存在host配置
        if(!host_config) return false
        // 存在host配置
        return host_config.config[host_config.valid]
    }
}

module.exports = Hosts
