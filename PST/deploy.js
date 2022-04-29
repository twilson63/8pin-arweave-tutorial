import Arweave from 'arweave'
import { SmartWeaveNodeFactory, LoggerFactory } from 'redstone-smartweave'
import fs from 'fs'
import path from 'path'

let contractSrc;

let wallet;
let walletAddress;
let initialState;
let arweave;
let pst;

arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

LoggerFactory.INST.logLevel('error');
const smartweave = SmartWeaveNodeFactory.memCachedBased(arweave).useRedStoneGateway().build()

contractSrc = fs.readFileSync(
  './dist/contract.js',
  'utf8'
);
const stateFromFile = JSON.parse(
  fs.readFileSync(
    './contract.json',
    'utf8'
  )
);

wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const contractTxId = await smartweave.createContract.deploy({
  wallet,
  initState: JSON.stringify(stateFromFile),
  src: contractSrc
});

console.log(contractTxId)