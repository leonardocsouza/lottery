const path = require('path');
const fs   = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
//console.log(inboxPath);

const source = fs.readFileSync(inboxPath, 'utf8');

// export just the Inbox contract, which is the one we care about
// so that other files can just do require('compile')
module.exports = solc.compile(source, 1).contracts[':Inbox'];

