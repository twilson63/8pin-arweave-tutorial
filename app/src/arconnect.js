export const connect = async () => {
  if (!window.arweaveWallet) {
    alert('ArConnect is not installed!')
    return ''
  }
  await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT'], { name: '8pin' })
  return await arweaveWallet.getActiveAddress()
}
