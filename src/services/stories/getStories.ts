import { collection, getDocs, query, orderBy, where, Firestore } from 'firebase/firestore'

export async function getStories(db: Firestore, filters?: {
  status?: 'draft' | 'publishing' | 'completed'
}) {
  try {
    const storiesRef = collection(db, 'stories')
    let q = query(storiesRef, orderBy('publishedAt', 'desc'))

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status))
    }

    const snapshot = await getDocs(q)
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate() || new Date(),
    }))

    return stories
  } catch (error) {
    console.error('Erro ao buscar histórias:', error)
    throw error
  }
}


