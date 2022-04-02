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

export const formToTx = (formData) => {
  return {
    data: formData.photo,
    tags: [
      { name: 'App-Name', value: '8pin' },
      { name: 'Protocol', value: '8pin' },
      { name: 'Title', value: formData.title },
      { name: 'Location', value: formData.location },
      { name: 'Description', value: formData.description },
      { name: 'Timestamp', value: formData.timestamp }
    ]
  }
}