import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({
  name: '8pin',
  logo: 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg'
})

wallet.setUrl('arweave.app')

export const connect = async () => {
  const result = await wallet.connect()
  if (result.ready) {
    const addr = arweaveWallet.getActiveAddress()
    localStorage.setItem('address', addr)
    localStorage.setItem('wallet', 'arweave.app')
    return addr
  }
  else {
    return null
  }
}