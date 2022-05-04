import Arweave from 'arweave'
import redstone from 'redstone-api'
import { calc } from './lib/calc.js'
import { selectWeightedPstHolder } from 'smartweave'
import { getVerification } from 'arverify'

const { SmartWeaveWebFactory, LoggerFactory } = window.rsdk

const CONTRACT_ID = 'ouND-cC3DCerx_2hrHY3c2X-9pu3OtSQEMo8p9iBXFM'

// we want to use a `.env` file for arlocal and if not set, then use
// arweave.net for production
const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

LoggerFactory.INST.logLevel('error')
const smartweave = SmartWeaveWebFactory.memCachedBased(arweave).useRedStoneGateway().build()
const pst = smartweave.pst(CONTRACT_ID).connect('use_wallet')

export const getTx = async (id) => {
  try {
    const result = await arweave.api.post('graphql', {
      query: `
  query {
    transaction(id: "${id}") {
      id
      owner {
        address
      }
      tags {
        name
        value
      }
    }
  }`
    })
    return result?.data?.data?.transaction
  } catch (e) {
    return null
  }
}

export const activity = async () => {
  try {
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transactions (first: 100, tags: { name: "Protocol", values: ["8pin"] }) {
    edges {
      node {
        id
        tags {
          name
          value
        }
      }
    }
  }
}
    `
    })
    return result?.data?.data?.transactions?.edges
  } catch (e) {
    return []
  }


}

/** 
 * Possible Errors
 * 1. Wallet not Connected!
 * 2. Not enough AR
 * 3. Unable to sign transaction
 */
export const submit = async ({ data, tags }) => {
  // 1. Wallet not Connected!
  if (window?.arweaveWallet === undefined) {
    return { ok: false, message: 'Wallet not connected!' }
  }
  const addr = await window.arweaveWallet.getActiveAddress()
  const balance = await getBalance(addr)
  let tx = null
  try {
    const verification = await getVerification(addr)
    if (verification.verified && verification.percentage > 60) {
      tx = await arweave.createTransaction({ data })
    } else {
      const AR = (await redstone.query().symbol('AR').latest().exec())['value']
      const quantity = arweave.ar.arToWinston(calc(1, AR).toString())
      const contractState = await pst.currentState()

      const holder = selectWeightedPstHolder(contractState.balances)
      tx = await arweave.createTransaction({ data, quantity, target: holder })
    }
    tags.map(({ name, value }) => tx.addTag(name, value))

    await arweave.transactions.sign(tx)
    // 2. check reward and wallet balance
    if (Number(tx.reward) + Number(tx.quantity) > Number(balance)) {
      return { ok: false, message: 'Not Enough AR to complete request!' }
    }
    const uploader = await arweave.transactions.getUploader(tx)
    return { ok: true, uploader, txId: tx.id }
  } catch (e) {
    console.log(e)
    return { ok: false, txId: tx.id, message: e.message }
  }
}

export const waitfor = async (txId) => {
  let count = 0;
  let foundPost = null;

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transaction(id: "${txId}") {
    id
  }
}
    `}).catch(e => {
        return ({
          data: { data: { transaction: null } }
        })
      });
    if (result.data.data.transaction) {
      foundPost = result.data.data.transaction.id === txId;
    }
    if (count > 10) {
      break; // could not find post
    }
  }
  return foundPost
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getBalance(addr) {
  let winston = await arweave.wallets.getBalance(addr)
  //let ar = arweave.ar.winstonToAr(winston);
  return winston
}