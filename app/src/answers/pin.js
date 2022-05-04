import { z } from 'zod'

const schema = z.object({
  id: z.string(),
  title: z.string().max(20),
  description: z.string().max(50),
  location: z.string().max(50),
  timestamp: z.string().max(50)
})

export const pinFromTx = (tx) => {

  try {
    return schema.parse({
      id: tx.id,
      title: (tx.tags.find(t => t.name === 'Title')).value,
      description: (tx.tags.find(t => t.name === 'Description')).value,
      location: tx.tags.find(t => t.name === 'Location').value,
      timestamp: tx.tags.find(t => t.name === 'Timestamp').value
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export const formToTx = (formData) => {
  return {
    data: formData.photo,
    tags: [
      { name: 'Content-Type', value: formData.contentType },
      { name: 'App-Name', value: '8pin' },
      { name: 'Protocol', value: '8pin' },
      { name: 'Title', value: formData.title },
      { name: 'Location', value: formData.location },
      { name: 'Description', value: formData.description },
      { name: 'Timestamp', value: formData.timestamp }
    ]
  }
}