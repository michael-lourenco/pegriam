/**
 * Script para migrar capítulos Markdown para Firestore
 * Execute com: node scripts/migrate-chapters.js
 * 
 * IMPORTANTE: Este script precisa ser executado em um ambiente Node.js
 * que tenha acesso ao Firebase. Pode ser necessário adaptar para usar
 * as credenciais corretas do Firebase.
 */

const fs = require('fs')
const path = require('path')

// Este script precisa ser adaptado para usar o Firebase Admin SDK
// Por enquanto, apenas lê os arquivos e prepara os dados

async function readChapterFiles() {
  const chaptersDir = path.join(process.cwd(), 'capitulos')
  const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'))
  
  const chapters = []

  for (const file of files) {
    const filePath = path.join(chaptersDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extrair número do capítulo
    const match = file.match(/capitulo-(\d+)/)
    const number = match ? parseInt(match[1], 10) : 0

    // Extrair título
    const titleMatch = content.match(/^## (.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : `Capítulo ${number}`

    // Contar palavras
    const words = content.trim().split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 palavras/minuto

    chapters.push({
      id: `capitulo-${number.toString().padStart(2, '0')}`,
      filename: file,
      number,
      title,
      content,
      wordCount,
      estimatedReadTime,
      isFree: number <= 2,
    })
  }

  return chapters.sort((a, b) => a.number - b.number)
}

async function generateMigrationData() {
  console.log('📖 Lendo arquivos Markdown...')
  const chapters = await readChapterFiles()
  
  console.log(`✅ Encontrados ${chapters.length} capítulos\n`)
  
  // Gerar dados para migração
  const storyData = {
    id: 'lenda-de-nix',
    title: 'Contos de Pegriam: A Lenda de Nix',
    description: 'A épica jornada de Nix Volstein, a futura primeira Fênix de Kontempler.',
    author: 'Pegriam, o Bardo',
    publishedAt: new Date().toISOString(),
    status: 'publishing',
    freeChapters: 2,
    pdfPrice: 2990,
    tags: ['fantasia', 'aventura', 'magia', 'épico'],
    metadata: {
      totalChapters: chapters.length,
      estimatedReadTime: chapters.reduce((sum, ch) => sum + ch.estimatedReadTime, 0),
    },
  }

  console.log('📚 Dados da História:')
  console.log(JSON.stringify(storyData, null, 2))
  console.log('\n📝 Capítulos:')
  
  chapters.forEach(ch => {
    console.log(`\nCapítulo ${ch.number}: ${ch.title}`)
    console.log(`  - ID: ${ch.id}`)
    console.log(`  - Palavras: ${ch.wordCount.toLocaleString()}`)
    console.log(`  - Tempo de leitura: ${ch.estimatedReadTime} min`)
    console.log(`  - Status: ${ch.isFree ? 'Gratuito' : 'Pago'}`)
  })

  console.log('\n💡 Para migrar, use a função migrateChapters do arquivo:')
  console.log('   src/lib/markdown/migrate-chapters.ts')
  console.log('\n   Ou execute via interface administrativa (a ser criada)')
}

generateMigrationData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })


