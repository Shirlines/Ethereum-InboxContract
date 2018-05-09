const mocha = require('mocha');
const ganache = require('ganache-cli');
const Web3 =require('web3');
const provider = ganache.provider()
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi there!']})
        .send({from: accounts[0], gas: '1000000'})

        inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () =>  {
        assert.ok(inbox.options.address);
    })

    it('Has a default message',async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!')
    });

    it('Can set a message', async () => {
        inbox.methods.setMessage('Dont come! Bye!').send();
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Dont come! Bye!')
    })
});