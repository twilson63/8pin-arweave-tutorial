export const connect = async () => {
  if (!window.arweaveWallet) {
    alert('ArConnect is not installed!')
    return ''
  }
  await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT'], { name: '8pin', logo: `${window.location.origin}/8pin-logo.png` })
  return await arweaveWallet.getActiveAddress()
}
