import { collection, getDocs, query, orderBy, where, Firestore } from 'firebase/firestore'
import type { Chapter } from '@/types/story'

export async function getChapters(
  db: Firestore,
  storyId: string,
  options?: {
    includeContent?: boolean
  }
): Promise<Chapter[]> {
  try {
    const chaptersRef = collection(db, 'chapters')
    const q = query(
      chaptersRef,
      where('storyId', '==', storyId),
      orderBy('order', 'asc')
    )

    const snapshot = await getDocs(q)
    const chapters = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt?.toDate() || new Date(),
        // Se não incluir conteúdo, remover para economizar banda
        content: options?.includeContent ? data.content : '',
      }
    })

    return chapters as Chapter[]
  } catch (error) {
    console.error('Erro ao buscar capítulos:', error)
    throw error
  }
}


