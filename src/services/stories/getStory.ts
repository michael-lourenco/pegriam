import { doc, getDoc, Firestore } from 'firebase/firestore'
import type { Story } from '@/types/story'

export async function getStory(db: Firestore, storyId: string): Promise<Story | null> {
  try {
    const storyRef = doc(db, 'stories', storyId)
    const storySnap = await getDoc(storyRef)

    if (!storySnap.exists()) {
      return null
    }

    const data = storySnap.data()
    return {
      id: storySnap.id,
      ...data,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    } as Story
  } catch (error) {
    console.error('Erro ao buscar história:', error)
    throw error
  }
}


