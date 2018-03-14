const path = require('path');
const fs   = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

const source = fs.readFileSync(lotteryPath, 'utf8');

// export just the Lottery contract, which is the one we care about
// so that other files can just do require('compile')
module.exports = solc.compile(source, 1).contracts[':Lottery'];

