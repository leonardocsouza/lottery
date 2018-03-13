const assert = require('assert');
const ganache = require('ganache-cli');

// first letter is uppercase because this is Constructor function
// this is defined this way by convention
const Web3 = require('web3');

const provider = ganache.provider();

// having a constructor to create a separate instance
// allows us to connect to more than one ethereum network
// from the same project (though this isn't that common)
// lowercase first letter (w) because this is the instance
const web3 = new Web3(provider);

const { interface, bytecode} = require('../compile');

let accounts;
let inbox;
const INITIAL_MESSAGE = 'hello world';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send({ from: accounts[0], gas: '1000000' });

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    // validates that we get an address
    // which indicates this contract was deployed
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();

    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async () => {
    const newMessage = 'test new msg';

    // we get transaction receipt back, but we don't use that
    // so we don't need to assign that to a variable
    // if it fails it will just crash here
    await inbox.methods.setMessage(newMessage)
      .send({ from: accounts[0] });

    const message = await inbox.methods.message().call();

    assert.equal(message, newMessage);
  });
});