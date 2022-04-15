import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({
  name: '8pin',
  logo: `${window.location.origin}/8pin-logo2.png`
})

wallet.setUrl('arweave.app')

export const connect = async () => {
  return null
}