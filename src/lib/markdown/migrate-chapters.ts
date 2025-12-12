/**
 * Script para migrar capítulos Markdown para Firestore
 * Execute com: npm run migrate-chapters
 */

import fs from 'fs'
import path from 'path'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { parseMarkdownToHTML, countWords, estimateReadingTime } from './parser'

interface ChapterFile {
  filename: string
  number: number
  title: string
  content: string
}

async function readChapterFiles(): Promise<ChapterFile[]> {
  const chaptersDir = path.join(process.cwd(), 'capitulos')
  const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'))
  
  const chapters: ChapterFile[] = []

  for (const file of files) {
    const filePath = path.join(chaptersDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extrair número do capítulo do nome do arquivo (ex: capitulo-01.md -> 1)
    const match = file.match(/capitulo-(\d+)/)
    const number = match ? parseInt(match[1], 10) : 0

    // Extrair título do markdown (primeira linha após ##)
    const titleMatch = content.match(/^## (.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : `Capítulo ${number}`

    chapters.push({
      filename: file,
      number,
      title,
      content,
    })
  }

  return chapters.sort((a, b) => a.number - b.number)
}

async function migrateChapters() {
  try {
    console.log('📖 Lendo arquivos Markdown...')
    const chapterFiles = await readChapterFiles()
    console.log(`✅ Encontrados ${chapterFiles.length} capítulos`)

    // Verificar se a história existe, se não, criar
    const storyId = 'lenda-de-nix'
    const storyRef = doc(dbFirestore, 'stories', storyId)
    const storySnap = await getDoc(storyRef)

    if (!storySnap.exists()) {
      console.log('📚 Criando história "A Lenda de Nix"...')
      await setDoc(storyRef, {
        title: 'Contos de Pegriam: A Lenda de Nix',
        description: 'A épica jornada de Nix Volstein, a futura primeira Fênix de Kontempler.',
        author: 'Pegriam, o Bardo',
        publishedAt: new Date(),
        status: 'publishing',
        freeChapters: 2, // Primeiros 2 capítulos gratuitos
        pdfPrice: 2990, // R$ 29,90 em centavos
        tags: ['fantasia', 'aventura', 'magia', 'épico'],
        metadata: {
          totalChapters: chapterFiles.length,
          estimatedReadTime: chapterFiles.reduce((sum, ch) => {
            const words = countWords(ch.content)
            return sum + estimateReadingTime(words)
          }, 0),
        },
      })
      console.log('✅ História criada!')
    }

    // Migrar capítulos
    console.log('📝 Migrando capítulos...')
    for (const chapterFile of chapterFiles) {
      const chapterId = `capitulo-${chapterFile.number.toString().padStart(2, '0')}`
      const chapterRef = doc(dbFirestore, 'chapters', chapterId)

      const wordCount = countWords(chapterFile.content)
      const estimatedReadTime = estimateReadingTime(wordCount)
      const isFree = chapterFile.number <= 2 // Primeiros 2 são gratuitos

      await setDoc(chapterRef, {
        storyId,
        number: chapterFile.number,
        title: chapterFile.title,
        content: chapterFile.content, // Armazenar markdown original
        publishedAt: new Date(),
        isFree,
        estimatedReadTime,
        wordCount,
        order: chapterFile.number,
      })

      console.log(`✅ Capítulo ${chapterFile.number}: ${chapterFile.title} (${isFree ? 'Gratuito' : 'Pago'})`)
    }

    console.log('🎉 Migração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    throw error
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrateChapters()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { migrateChapters }


