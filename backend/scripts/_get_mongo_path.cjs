const { MongoBinary } = require('mongodb-memory-server-core');
MongoBinary.getPath({}).then(p => { console.log(p); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });
