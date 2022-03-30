const Arweave = require('arweave')
const fs = require('fs')
const input = require('./data/1.json')
const data = fs.readFileSync('./data/image1.png')
const arweave = Arweave.init({
  port: 1984
});

(async () => {
  const w = await arweave.wallets.generate()
  const addr = await arweave.wallets.jwkToAddress(w)
  const tokens = arweave.ar.arToWinston(100)
  // mint some tokens
  await arweave.api.get(`mint/${addr}/${tokens}`)
  await arweave.api.get('mine')

  const tx = await arweave.createTransaction({
    data
  }, w)
  input.tags.map(tag => {
    tx.addTag(tag.name, tag.value)
  })
  await arweave.transactions.sign(tx, w)
  let uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
  }
  await arweave.api.get('mine')
  console.log('done')

})()
