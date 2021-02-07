var os = require('os');
///import os from 'os'
console.log(os.platform())
console.log(os.arch())
console.log(`${os.cpus().length} core system`);
console.log(os.freemem())
console.log(os.uptime())