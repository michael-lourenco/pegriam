"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useGemini } from "@/hooks/useGemini"
import { UserInfo } from "@/components/UserInfo"
import { Loading } from "@/components/Loading"
import { LoadingDefault } from "@/components/LoadingDefault"
import { Stories, type StoryData } from "@/components/story/Stories"
import { updateStory, updateUserCredits, dbFirestore } from "@/services/firebase/FirebaseService"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/Footer"
import { StoryReader } from "@/components/StoryReader"
import { StoryControls } from "@/components/StoryControls"
import { Button } from "@/components/ui/button"
import { StoryGeneratorModal } from "@/components/StoryGeneratorModal"
import { TemplateSelector } from "@/components/TemplateSelector"
import type { Template } from "@/types/template"
import { Icon, type IconName } from "@/components/icons"
import LoginComponent from "@/components/LoginComponent"

export default function StoryPage() {
  const [selectedStory, setSelectedStory] = useState<StoryData | null>(null)
  const [generateContent, setGenerateContent] = useState<boolean>(false)
  const [localContent, setLocalContent] = useState<boolean>(false)
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false)
  const [prompt, setPrompt] = useState<string>(`
  Crie uma história curta e envolvente, com no máximo 2000 caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser mágica, aconchegante e transmitir uma mensagem positiva sobre [tema específico].

Retorne o texto formatado em HTML com a seguinte estrutura e classes Tailwind:

<article class="space-y-6">
    <h2 class="text-2xl font-bold text-primary text-center">[Título da História]</h2>
    
    <div class="space-y-4">
        <!-- Introdução -->
        <p class="text-lg text-foreground">[Texto introdutório]</p>

        <!-- Diálogos -->
        <p class="text-lg text-primary pl-4 border-l-2 border-primary">[Diálogos dos personagens]</p>

        <!-- Descrições -->
        <p class="text-lg text-foreground">[Descrições de cenário ou ações]</p>

        <!-- Momentos especiais -->
        <p class="text-lg text-accent font-medium">[Momentos mágicos ou importantes]</p>

        <!-- Final -->
        <p class="text-lg text-primary font-medium">[Conclusão da história]</p>
    </div>

    <!-- Moral ou mensagem -->
    <div class="mt-6 p-4 bg-card rounded-lg border border-border">
        <p class="text-lg text-primary italic">[Moral ou mensagem da história]</p>
    </div>
</article>

A história deve conter:
1. Um título cativante
2. Uma introdução que estabeleça o cenário
3. Um protagonista carismático
4. Um desafio ou conflito leve
5. Elementos mágicos ou fantásticos
6. Um final feliz e reconfortante
7. Uma moral ou lição sutilmente apresentada
8. Retorne o HTML diretamente, sem formatação adicional. O conteúdo deve começar imediatamente com <article> e terminar com </article>.
`)


  const handlePrompt = (template: Template) => {
    // Aqui você pode manipular o template para criar o prompt
    const promptText = `
    Crie uma história curta e envolvente, com no máximo ${template.storyLength == "curta" ? "2000" : template.storyLength == "média" ? "3000" : template.storyLength == "longa" ? "4000" : "2000"} caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser aconchegante e transmitir uma mensagem positiva sobre ${template.themes.join(", ")}.

Retorne o texto formatado em HTML com a seguinte estrutura e classes Tailwind:

<article class="space-y-6">
    <h2 class="text-2xl font-bold text-primary text-center">[Título da História]</h2>
    
    <div class="space-y-4">
        <!-- Introdução -->
        <p class="text-lg text-foreground">[Texto introdutório]</p>

        <!-- Diálogos -->
        <p class="text-lg text-primary pl-4 border-l-2 border-primary">[Diálogos dos personagens]</p>

        <!-- Descrições -->
        <p class="text-lg text-foreground">[Descrições de cenário ou ações]</p>

        <!-- Momentos especiais -->
        <p class="text-lg text-accent font-medium">[Momentos mágicos ou importantes]</p>

        <!-- Final -->
        <p class="text-lg text-primary font-medium">[Conclusão da história]</p>
    </div>

    <!-- Moral ou mensagem -->
    <div class="mt-6 p-4 bg-card rounded-lg border border-border">
        <p class="text-lg text-primary italic">[Moral ou mensagem da história]</p>
    </div>
</article>

A história deve conter:
1. Um título cativante
2. Uma introdução que estabeleça o cenário
3. Um protagonista carismático
4. Um desafio ou conflito leve
5. Um final feliz e reconfortante
6. Uma moral ou lição sutilmente apresentada
7. Retorne o HTML diretamente, sem formatação adicional. O conteúdo deve começar imediatamente com <article> e terminar com </article>.
  `
    setGenerateContent(false)
    setPrompt(promptText)
  }

  function extractTitle(htmlString: string): string {
    // Regex para encontrar o conteúdo entre as tags h2, considerando múltiplas linhas
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/

    // Procura pelo match no htmlString
    const match = htmlString.match(h2Regex)

    // Retorna o conteúdo encontrado (removendo espaços extras) ou string vazia se não encontrar
    return match ? match[1].trim() : ""
  }

  const { user, loading: authLoading, status, handleLogin, handleLogout } = useAuth()


  const [userCredits, setUserCredits] = useState(user?.credits.value || 0)

  const { response, setResponse, title, loading, error } = useGemini(prompt, generateContent);

  const endRead = useCallback(() => {
    queueMicrotask(async () => {
      if (!user) return
      const title = response ? extractTitle(response) : "Sem titulo"
      const now = new Date()
      if (userCredits > 0) {
        await updateStory(
          user.email,
          { date: now, prompt: prompt, title: title, story: response || "Sem resposta" },
          dbFirestore,
        )
        await updateUserCredits(user.email, -1, dbFirestore)
        setUserCredits((prevCredits) => prevCredits - 1)
        setShowSaveButton(false)
      }
    })
  }, [prompt, response, user, userCredits, showSaveButton])

  const handleSaveClick = useCallback(() => {
    console.log("TAMANHO DA RESPOSTA ", response?.length)
    if (response && response.length > 300) {
      endRead()
    }
  }, [endRead])

  const handleGenerateStory = useCallback(() => {
    setLocalContent(false)
    setGenerateContent(true)
    setShowSaveButton(true)
  }, [generateContent, showSaveButton])

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingDefault />
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <>
      {user ? (
        <div className="flex flex-col min-h-screen bg-background text-primary">
          <main className="flex-grow flex flex-col items-center justify-start pt-4">
            <div className="max-w-4xl relative">
              <UserInfo
                user={{ ...user, credits: { value: userCredits, updatedAt: user.credits.updatedAt } }}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
              />

              {userCredits > 0 ? (
                !localContent &&
                !selectedStory && (
                  <>
                    <div className="flex justify-center items-center max-w-full space-x-2 overflow-hidden">
                      <TemplateSelector user={user} onTemplateSelect={handlePrompt} />
                      <StoryGeneratorModal user={user} />
                    </div>
                    <div className="flex justify-center items-center max-w-full m-10">
                      <Button className="text-primary hover:scale-110 hover:animate-pulse  active:scale-95" onClick={handleGenerateStory}>
                        <Image
                          src="/images/buttons/new_story.png"
                          alt="Play"
                          width={277}
                          height={87}
                          className="mt-4"
                        />
                      </Button>
                    </div>
                    {loading && (
                      <div className="flex justify-center items-center max-w-full">
                        <Loading />
                      </div>
                    )}
                        
                    {error && <p className="text-red-500">{error}</p>}
                  </>
                )
              ) : (
                <></>
              )}

              {userCredits <= 0 ? (
                <>
                  <div className="flex flex-col text-primary mb-4 bg-baclkground rounded-lg">
                    <div className="grid grid-cols-[1fr,auto] items-center gap-2">
                      <Button
                        onClick={async () => {
                          await updateUserCredits(user.email, 1, dbFirestore)
                          setUserCredits((prevCredits) => prevCredits + 1)
                        }}
                        variant="default"
                        className="hover:scale-110 hover:animate-pulse  active:scale-95"
                      >
                        <Image
                          src='/images/buttons/btn_new_story_buy_coins.png'
                          alt="Coins"
                          width={277}
                          height={87}
                          className=""
                        />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <> </>
              )}

            {!localContent &&
                !selectedStory ? (
                  <>
                    {response && response.length > 300 && showSaveButton ? <StoryControls handleSaveClick={handleSaveClick} /> : <></>}
                    <StoryReader
                      prompt={prompt}
                      response={response}
                      title={title}
                      user={user}
                      handleLogin={handleLogin}
                      handleLogout={handleLogout}
                    />
                    
                  </>
                ) : (
                <></>
              )}




              {selectedStory && (
                <>
                  <StoryReader
                    prompt="local"
                    response={selectedStory.story}
                    title={selectedStory.title}
                    user={user}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                  />
                  <div className="flex justify-center items-center max-w-full overflow-hidden">
                    <Button
                      className="m-5"
                      onClick={() => {
                        setLocalContent(false)
                        setSelectedStory(null)
                        setResponse(null)
                        setGenerateContent(false)
                        setPrompt(`
  Crie uma história curta e envolvente, com no máximo 2000 caracteres, perfeita para um pai ou mãe ler para seu filho antes de dormir. A história deve ser mágica, aconchegante e transmitir uma mensagem positiva sobre [tema específico].

Retorne o texto formatado em HTML com a seguinte estrutura e classes Tailwind:

<article class="space-y-6">
    <h2 class="text-2xl font-bold text-primary text-center">[Título da História]</h2>
    
    <div class="space-y-4">
        <!-- Introdução -->
        <p class="text-lg text-foreground">[Texto introdutório]</p>

        <!-- Diálogos -->
        <p class="text-lg text-primary pl-4 border-l-2 border-primary">[Diálogos dos personagens]</p>

        <!-- Descrições -->
        <p class="text-lg text-foreground">[Descrições de cenário ou ações]</p>

        <!-- Momentos especiais -->
        <p class="text-lg text-accent font-medium">[Momentos mágicos ou importantes]</p>

        <!-- Final -->
        <p class="text-lg text-primary font-medium">[Conclusão da história]</p>
    </div>

    <!-- Moral ou mensagem -->
    <div class="mt-6 p-4 bg-card rounded-lg border border-border">
        <p class="text-lg text-primary italic">[Moral ou mensagem da história]</p>
    </div>
</article>

A história deve conter:
1. Um título cativante
2. Uma introdução que estabeleça o cenário
3. Um protagonista carismático
4. Um desafio ou conflito leve
5. Elementos mágicos ou fantásticos
6. Um final feliz e reconfortante
7. Uma moral ou lição sutilmente apresentada
8. Retorne o HTML diretamente, sem formatação adicional. O conteúdo deve começar imediatamente com <article> e terminar com </article>.
`)
                      }}
                    >
                      <Image
                        src="/images/buttons/new_story.png"
                        alt="Play"
                        width={188}
                        height={92}
                        className="mt-4"
                      />
                    </Button>
                  </div>
                </>
              )}

 
                  {status === "loading" ? (
                    <p>Loading...</p>
                  ) : (
                    <Stories
                      storiesData={
                        user?.story?.map((story) => ({
                          ...story,
                          id: story.id,
                          date: story.date instanceof Date ? story.date.toISOString() : story.date,
                        })) || null
                      }
                      onRowClick={setSelectedStory}
                    />
                  )}
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        <>
          <div className="flex flex-col min-h-screen bg-background text-primary">
            <main className="flex-grow flex flex-col items-center justify-start pt-4">
              <div className="max-w-4xl mx-auto relative">
                <LoginComponent />
              </div>
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  )
}

