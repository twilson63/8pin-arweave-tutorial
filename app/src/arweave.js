import Arweave from 'arweave'

// we want to use a `.env` file for arlocal and if not set, then use
// arweave.net for production
const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

export const getTx = async (id) => {
  return null
}

export const activity = async () => {
  return null
}

export const submit = async ({ data, tags }) => {
  return null
}

export const waitfor = async (txId) => {
  return null
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

