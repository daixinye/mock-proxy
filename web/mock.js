const mockData = require('./../config/mock.json')

class Mock {
    constructor() {
        this.hostnameConfigs = null
        this.pathConfigs = null
        this.config = null
    }

    getHostnameConfigs(hostname) {
        // 获取 hostname 配置表
        return mockData[hostname] || false
    }

    getPathConfigs(path) {
        // 获取 hostname 下 path 的配置表
        return (this.hostnameConfigs && this.hostnameConfigs[path]) || false
    }

    getConfig(req) {
        if (!this.pathConfigs) return false

        let {
            get,
            post
        } = req

        for (let i = 0; i < this.pathConfigs.length; i++) {
            let config = this.pathConfigs[i]
            // todo 返回配置文件
        }
    }
}

module.exports = Mock