export const pinFromTx = (tx) => {
  try {
    return {
      id: tx.id,
      title: (tx.tags.find(t => t.name === 'Title')).value,
      location: tx.tags.find(t => t.name === 'Location').value,
      timestamp: tx.tags.find(t => t.name === 'Timestamp').value
    }
  } catch (e) {
    return null
  }
}