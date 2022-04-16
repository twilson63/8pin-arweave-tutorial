import Arweave from 'arweave'

// we want to use a `.env` file for arlocal and if not set, then use
// arweave.net for production
const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

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
  transactions (tags: { name: "Protocol", values: ["8pin"] }) {
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

  const tx = await arweave.createTransaction({ data })
  tags.map(({ name, value }) => tx.addTag(name, value))

  try {
    await arweave.transactions.sign(tx)
    const uploader = await arweave.transactions.getUploader(tx)
    return { ok: true, uploader, txId: tx.id }
  } catch (e) {
    console.log(e)
    return { ok: false, tx, message: e.message }
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

