import { doc, getDoc, Firestore } from 'firebase/firestore'
import type { Chapter } from '@/types/story'

export async function getChapter(
  db: Firestore,
  chapterId: string
): Promise<Chapter | null> {
  try {
    const chapterRef = doc(db, 'chapters', chapterId)
    const chapterSnap = await getDoc(chapterRef)

    if (!chapterSnap.exists()) {
      return null
    }

    const data = chapterSnap.data()
    return {
      id: chapterSnap.id,
      ...data,
      publishedAt: data.publishedAt?.toDate() || new Date(),
    } as Chapter
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error)
    throw error
  }
}


