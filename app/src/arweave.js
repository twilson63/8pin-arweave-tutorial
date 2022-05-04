import Arweave from 'arweave'

const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

export const activity = async () => {
  return []
}
export const submit = async ({ data, tags }) => {
  return {}

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