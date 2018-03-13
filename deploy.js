if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  process.env.DEPLOY_ACCOUNT_MNEMONIC,
  process.env.DEPLOY_PROVIDER_URL
);

const web3 = new Web3(provider);

// Create deploy function just so we can use async/await syntax
const deploy = async () => {
  // Get list of accounts unlocked via the HDWallerProvider
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });

  // Log address of contract deployment
  console.log('Contract deployed to', result.options.address);
};
deploy();