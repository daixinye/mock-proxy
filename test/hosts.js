const Hosts = new require('../proxy/hosts')

const hosts = new Hosts()
console.log(hosts)

let config = hosts.get('www.csdn.net')
console.log(config)
let no_config = hosts.get('www.notFound.com')
console.log(no_config)