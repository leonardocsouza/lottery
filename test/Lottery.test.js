const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();

// having a constructor to create a separate instance
// allows us to connect to more than one ethereum network
// from the same project (though this isn't that common)
// lowercase first letter (w) because this is the instance
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })

  // this is needed or it doesn't work
  // (some tutorial in part 1 explained it)
  lottery.setProvider(provider);
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.01', 'ether')
      });
      // it should have failed before getting to here
      assert(false);
    } catch (err) {
      // check that we have an error
      assert(err);

      // check that error isn't the "forced" AssertionError
      // caused by assert(false)
      assert(!(err instanceof assert.AssertionError));
    }
  });

  it('only manager can call pickWinner', async () => {
    // enter non-manager account into lottery
    // we need this, becaues otherwise even calling
    // pickWinner with the manager would fail
    // and we want to be sure the test fails only
    // when trying to call pickWinner with a non-manager
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      // it should have failed before getting to here
      assert(false);
    } catch (err) {
      // check that we have an error
      assert(err);

      // check that error isn't the "forced" AssertionError
      // caused by assert(false)
      assert(!(err instanceof assert.AssertionError));
    }
  });

  it('sends money to winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({from: accounts[0]});
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    // account lost some ether due to transaction costs
    // so we check that it got close to 2 ether back
    assert(difference > web3.utils.toWei('1.8', 'ether'), 'received about 2 ether');

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(0, players.length, 'reset players array');
  });
});