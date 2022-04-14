export const isAvailable() {
  return arweaveWallet !== null
}

export const connect() {
  return arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT'], { name: '8pin' })

}

export const disconnect() {
  return arweaveWallet.disconnect()
}