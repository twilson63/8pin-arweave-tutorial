import Arweave from 'arweave'

const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

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

export const submit = async ({ data, tags }) => {
  // 1. Wallet not Connected!
  if (window?.arweaveWallet === undefined) {
    return { ok: false, message: 'Wallet not connected!' }
  }

  const balance = await getBalance(await window.arweaveWallet.getActiveAddress())

  try {
    const tx = await arweave.createTransaction({ data })
    tags.map(({ name, value }) => tx.addTag(name, value))
    await arweave.transactions.sign(tx)
    // 2. check reward and wallet balance
    if (Number(tx.reward) > Number(balance)) {
      return { ok: false, message: 'Not Enough AR to complete request!' }
    }
    const uploader = await arweave.transactions.getUploader(tx)
    return { ok: true, uploader, txId: tx.id }
  } catch (e) {
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
  }
      `
    })
    return result?.data?.data?.transaction
  } catch (e) {
    return null
  }
}


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getBalance(addr) {
  let winston = await arweave.wallets.getBalance(addr)
  //let ar = arweave.ar.winstonToAr(winston);
  return winston
}