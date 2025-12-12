'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { getStory } from '@/services/stories/getStory'
import type { Story } from '@/types/story'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingDefault } from '@/components/LoadingDefault'
import Link from 'next/link'

export default function PurchasePage() {
  const params = useParams()
  const storyId = params.storyId as string

  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStory() {
      try {
        const storyData = await getStory(dbFirestore, storyId)
        setStory(storyData)
      } catch (error) {
        console.error('Erro ao buscar história:', error)
      } finally {
        setLoading(false)
      }
    }

    if (storyId) {
      fetchStory()
    }
  }, [storyId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDefault />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">História não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const priceInReais = (story.pdfPrice / 100).toFixed(2).replace('.', ',')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Comprar {story.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue sua aventura com o livro completo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Capa e Informações */}
          <div>
            {story.coverImage && (
              <div className="mb-6">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-xl"
                />
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>O que você recebe</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Todos os {story.metadata.totalChapters} capítulos em PDF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Formatação profissional para leitura</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Download imediato após a compra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Acesso permanente ao arquivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>{story.metadata.estimatedReadTime} minutos de leitura épica</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Área de Compra */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  R$ {priceInReais}
                </CardTitle>
                <CardDescription className="text-center">
                  Livro completo em PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* TODO: Integrar com Stripe */}
                <Button className="w-full" size="lg">
                  Comprar Agora
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Pagamento seguro processado por Stripe
                </p>

                <div className="pt-4 border-t border-border">
                  <Link href={`/stories/${storyId}`}>
                    <Button variant="ghost" className="w-full">
                      ← Voltar para a história
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sinopse */}
        <Card>
          <CardHeader>
            <CardTitle>Sinopse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{story.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


